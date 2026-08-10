from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.player import Player
from app.models.notification import MatchInvitation, Notification
from app.models.scheduled_match import ScheduledMatch


invitation_bp = Blueprint(
    "invitation",
    __name__,
    url_prefix="/api/invitations"
)


# =========================================================
# HELPER — GET CURRENT PLAYER
# =========================================================

def get_current_player():
    user_id = get_jwt_identity()

    return Player.query.filter_by(
        user_id=user_id
    ).first()


# =========================================================
# HELPER — CREATE NOTIFICATION
# =========================================================

def create_notification(
    player_id,
    notification_type,
    title,
    message,
    related_id=None
):

    notification = Notification(
        player_id=player_id,
        type=notification_type,
        title=title,
        message=message,
        related_id=related_id,
        is_read=False
    )

    db.session.add(notification)

    return notification


# =========================================================
# SEND MATCH INVITATION
# =========================================================

@invitation_bp.route("", methods=["POST"])
@jwt_required()
def send_invitation():

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    data = request.get_json() or {}

    receiver_id = data.get("receiver_id")
    scheduled_at = data.get("scheduled_at")
    duration_minutes = data.get("duration_minutes")
    location = data.get("location")
    message = data.get("message")

    # -----------------------------------------------------
    # Required fields
    # -----------------------------------------------------

    if receiver_id is None:

        return jsonify({
            "success": False,
            "message": "receiver_id is required"
        }), 400

    # -----------------------------------------------------
    # Validate receiver ID
    # -----------------------------------------------------

    try:

        receiver_id = int(receiver_id)

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message": "receiver_id must be a number"
        }), 400

    # -----------------------------------------------------
    # Cannot invite yourself
    # -----------------------------------------------------

    if receiver_id == current_player.id:

        return jsonify({
            "success": False,
            "message": "You cannot invite yourself"
        }), 400

    # -----------------------------------------------------
    # Find receiver
    # -----------------------------------------------------

    receiver = db.session.get(
        Player,
        receiver_id
    )

    if not receiver:

        return jsonify({
            "success": False,
            "message": "Player not found"
        }), 404

    # -----------------------------------------------------
    # Parse scheduled time if provided
    # -----------------------------------------------------

    scheduled_datetime = None

    if scheduled_at:

        try:

            scheduled_datetime = datetime.fromisoformat(
                scheduled_at.replace("Z", "+00:00")
            )

        except (TypeError, ValueError):

            return jsonify({
                "success": False,
                "message": (
                    "Invalid scheduled_at format. "
                    "Use ISO format such as "
                    "2026-08-10T18:00:00"
                )
            }), 400

    # -----------------------------------------------------
    # Validate duration
    # -----------------------------------------------------

    if duration_minutes is not None:

        try:

            duration_minutes = int(
                duration_minutes
            )

        except (TypeError, ValueError):

            return jsonify({
                "success": False,
                "message": "duration_minutes must be a number"
            }), 400

        if duration_minutes <= 0:

            return jsonify({
                "success": False,
                "message": "duration_minutes must be greater than 0"
            }), 400

    # -----------------------------------------------------
    # Prevent duplicate pending invitation
    # -----------------------------------------------------

    existing_invitation = MatchInvitation.query.filter(
        MatchInvitation.sender_id == current_player.id,
        MatchInvitation.receiver_id == receiver.id,
        MatchInvitation.status == "pending"
    ).first()

    if existing_invitation:

        return jsonify({
            "success": False,
            "message": "You already have a pending invitation for this player"
        }), 409

    # -----------------------------------------------------
    # Create invitation
    # -----------------------------------------------------

    invitation = MatchInvitation(
        sender_id=current_player.id,
        receiver_id=receiver.id,
        scheduled_at=scheduled_datetime,
        duration_minutes=duration_minutes,
        location=location,
        message=message,
        status="pending"
    )

    db.session.add(invitation)

    # -----------------------------------------------------
    # Create notification for receiver
    # -----------------------------------------------------

    sender_name = (
        current_player.full_name
        or current_player.username
    )

    create_notification(
        player_id=receiver.id,
        notification_type="match_invitation",
        title="New Match Invitation",
        message=f"{sender_name} sent you a match invitation.",
        related_id=invitation.id
    )

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not send invitation"
        }), 500

    return jsonify({
        "success": True,
        "message": "Match invitation sent successfully",
        "invitation": invitation.to_dict()
    }), 201


# =========================================================
# GET RECEIVED INVITATIONS
# =========================================================

@invitation_bp.route("/received", methods=["GET"])
@jwt_required()
def get_received_invitations():

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    status = request.args.get("status")

    query = MatchInvitation.query.filter(
        MatchInvitation.receiver_id == current_player.id
    )

    if status:

        query = query.filter(
            MatchInvitation.status == status
        )

    invitations = query.order_by(
        MatchInvitation.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "count": len(invitations),
        "invitations": [
            invitation.to_dict()
            for invitation in invitations
        ]
    }), 200


# =========================================================
# GET SENT INVITATIONS
# =========================================================

@invitation_bp.route("/sent", methods=["GET"])
@jwt_required()
def get_sent_invitations():

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    status = request.args.get("status")

    query = MatchInvitation.query.filter(
        MatchInvitation.sender_id == current_player.id
    )

    if status:

        query = query.filter(
            MatchInvitation.status == status
        )

    invitations = query.order_by(
        MatchInvitation.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "count": len(invitations),
        "invitations": [
            invitation.to_dict()
            for invitation in invitations
        ]
    }), 200


# =========================================================
# ACCEPT INVITATION
# =========================================================

@invitation_bp.route(
    "/<int:invitation_id>/accept",
    methods=["PUT"]
)
@jwt_required()
def accept_invitation(invitation_id):

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    invitation = db.session.get(
        MatchInvitation,
        invitation_id
    )

    if not invitation:

        return jsonify({
            "success": False,
            "message": "Invitation not found"
        }), 404

    # -----------------------------------------------------
    # Only receiver can accept
    # -----------------------------------------------------

    if invitation.receiver_id != current_player.id:

        return jsonify({
            "success": False,
            "message": "You cannot accept this invitation"
        }), 403

    # -----------------------------------------------------
    # Check status
    # -----------------------------------------------------

    if invitation.status != "pending":

        return jsonify({
            "success": False,
            "message": (
                f"Invitation is already "
                f"{invitation.status}"
            )
        }), 400

    # -----------------------------------------------------
    # Create scheduled match
    # -----------------------------------------------------

    scheduled_match = ScheduledMatch(
        player1_id=invitation.sender_id,
        player2_id=invitation.receiver_id,
        scheduled_at=invitation.scheduled_at,
        duration_minutes=invitation.duration_minutes,
        location=invitation.location,
        notes=invitation.message,
        status="scheduled",
        created_by=invitation.sender_id
    )

    db.session.add(scheduled_match)

    # -----------------------------------------------------
    # Update invitation
    # -----------------------------------------------------

    invitation.status = "accepted"
    invitation.responded_at = datetime.utcnow()

    # -----------------------------------------------------
    # Notify sender
    # -----------------------------------------------------

    receiver_name = (
        current_player.full_name
        or current_player.username
    )

    create_notification(
        player_id=invitation.sender_id,
        notification_type="invitation_accepted",
        title="Invitation Accepted",
        message=(
            f"{receiver_name} accepted your "
            f"match invitation."
        ),
        related_id=invitation.id
    )

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not accept invitation"
        }), 500

    # -----------------------------------------------------
    # Link invitation to scheduled match
    # -----------------------------------------------------

    invitation.scheduled_match_id = scheduled_match.id

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Invitation accepted but "
                "could not link scheduled match"
            )
        }), 500

    return jsonify({
        "success": True,
        "message": "Invitation accepted successfully",
        "invitation": invitation.to_dict(),
        "scheduled_match": scheduled_match.to_dict()
    }), 200


# =========================================================
# DECLINE INVITATION
# =========================================================

@invitation_bp.route(
    "/<int:invitation_id>/decline",
    methods=["PUT"]
)
@jwt_required()
def decline_invitation(invitation_id):

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    invitation = db.session.get(
        MatchInvitation,
        invitation_id
    )

    if not invitation:

        return jsonify({
            "success": False,
            "message": "Invitation not found"
        }), 404

    # -----------------------------------------------------
    # Only receiver can decline
    # -----------------------------------------------------

    if invitation.receiver_id != current_player.id:

        return jsonify({
            "success": False,
            "message": "You cannot decline this invitation"
        }), 403

    # -----------------------------------------------------
    # Check status
    # -----------------------------------------------------

    if invitation.status != "pending":

        return jsonify({
            "success": False,
            "message": (
                f"Invitation is already "
                f"{invitation.status}"
            )
        }), 400

    invitation.status = "declined"
    invitation.responded_at = datetime.utcnow()

    receiver_name = (
        current_player.full_name
        or current_player.username
    )

    # -----------------------------------------------------
    # Notify sender
    # -----------------------------------------------------

    create_notification(
        player_id=invitation.sender_id,
        notification_type="invitation_declined",
        title="Invitation Declined",
        message=(
            f"{receiver_name} declined your "
            f"match invitation."
        ),
        related_id=invitation.id
    )

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not decline invitation"
        }), 500

    return jsonify({
        "success": True,
        "message": "Invitation declined successfully",
        "invitation": invitation.to_dict()
    }), 200