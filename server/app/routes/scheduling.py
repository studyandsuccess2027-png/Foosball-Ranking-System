from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.player import Player
from app.models.scheduled_match import ScheduledMatch


scheduling_bp = Blueprint(
    "scheduling",
    __name__,
    url_prefix="/api/scheduled-matches"
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
# CREATE SCHEDULED MATCH
# =========================================================

@scheduling_bp.route("", methods=["POST"])
@jwt_required()
def create_scheduled_match():

    current_player = get_current_player()

    if not current_player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    data = request.get_json() or {}

    player2_id = data.get("player2_id")
    scheduled_at = data.get("scheduled_at")
    duration_minutes = data.get("duration_minutes")
    location = data.get("location")
    notes = data.get("notes")

    # -----------------------------------------------------
    # Required fields
    # -----------------------------------------------------

    if player2_id is None or not scheduled_at:
        return jsonify({
            "success": False,
            "message": "player2_id and scheduled_at are required"
        }), 400

    # -----------------------------------------------------
    # Validate player ID
    # -----------------------------------------------------

    try:
        player2_id = int(player2_id)
    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message": "player2_id must be a number"
        }), 400

    # -----------------------------------------------------
    # Player cannot schedule against himself
    # -----------------------------------------------------

    if player2_id == current_player.id:

        return jsonify({
            "success": False,
            "message": "You cannot schedule a match with yourself"
        }), 400

    # -----------------------------------------------------
    # Check opponent
    # -----------------------------------------------------

    opponent = db.session.get(
        Player,
        player2_id
    )

    if not opponent:

        return jsonify({
            "success": False,
            "message": "Opponent player not found"
        }), 404

    # -----------------------------------------------------
    # Parse date/time
    # -----------------------------------------------------

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
    # Duration
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
    # Prevent duplicate active schedule
    # -----------------------------------------------------

    existing_schedule = ScheduledMatch.query.filter(
        db.or_(
            db.and_(
                ScheduledMatch.player1_id == current_player.id,
                ScheduledMatch.player2_id == opponent.id
            ),
            db.and_(
                ScheduledMatch.player1_id == opponent.id,
                ScheduledMatch.player2_id == current_player.id
            )
        ),
        ScheduledMatch.scheduled_at == scheduled_datetime,
        ScheduledMatch.status == "scheduled"
    ).first()

    if existing_schedule:

        return jsonify({
            "success": False,
            "message": "This match is already scheduled for this time"
        }), 409

    # -----------------------------------------------------
    # Create schedule
    # -----------------------------------------------------

    scheduled_match = ScheduledMatch(
        player1_id=current_player.id,
        player2_id=opponent.id,
        scheduled_at=scheduled_datetime,
        duration_minutes=duration_minutes,
        location=location,
        notes=notes,
        status="scheduled",
        created_by=current_player.id
    )

    db.session.add(scheduled_match)

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not create scheduled match"
        }), 500

    return jsonify({
        "success": True,
        "message": "Match scheduled successfully",
        "scheduled_match": scheduled_match.to_dict()
    }), 201


# =========================================================
# GET MY SCHEDULED MATCHES
# =========================================================

@scheduling_bp.route("", methods=["GET"])
@jwt_required()
def get_my_scheduled_matches():

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    status = request.args.get("status")

    query = ScheduledMatch.query.filter(
        db.or_(
            ScheduledMatch.player1_id == current_player.id,
            ScheduledMatch.player2_id == current_player.id
        )
    )

    if status:

        query = query.filter(
            ScheduledMatch.status == status
        )

    matches = query.order_by(
        ScheduledMatch.scheduled_at.asc()
    ).all()

    return jsonify({
        "success": True,
        "count": len(matches),
        "scheduled_matches": [
            match.to_dict()
            for match in matches
        ]
    }), 200


# =========================================================
# GET SINGLE SCHEDULED MATCH
# =========================================================

@scheduling_bp.route("/<int:schedule_id>", methods=["GET"])
@jwt_required()
def get_scheduled_match(schedule_id):

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    scheduled_match = db.session.get(
        ScheduledMatch,
        schedule_id
    )

    if not scheduled_match:

        return jsonify({
            "success": False,
            "message": "Scheduled match not found"
        }), 404

    # -----------------------------------------------------
    # Only participants can view schedule
    # -----------------------------------------------------

    if (
        scheduled_match.player1_id != current_player.id
        and
        scheduled_match.player2_id != current_player.id
    ):

        return jsonify({
            "success": False,
            "message": "You are not part of this scheduled match"
        }), 403

    return jsonify({
        "success": True,
        "scheduled_match": scheduled_match.to_dict()
    }), 200


# =========================================================
# CANCEL SCHEDULED MATCH
# =========================================================

@scheduling_bp.route(
    "/<int:schedule_id>/cancel",
    methods=["PUT"]
)
@jwt_required()
def cancel_scheduled_match(schedule_id):

    current_player = get_current_player()

    if not current_player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    scheduled_match = db.session.get(
        ScheduledMatch,
        schedule_id
    )

    if not scheduled_match:

        return jsonify({
            "success": False,
            "message": "Scheduled match not found"
        }), 404

    # -----------------------------------------------------
    # Only participants can cancel
    # -----------------------------------------------------

    if (
        scheduled_match.player1_id != current_player.id
        and
        scheduled_match.player2_id != current_player.id
    ):

        return jsonify({
            "success": False,
            "message": "You are not part of this scheduled match"
        }), 403

    # -----------------------------------------------------
    # Already cancelled
    # -----------------------------------------------------

    if scheduled_match.status == "cancelled":

        return jsonify({
            "success": False,
            "message": "Scheduled match is already cancelled"
        }), 400

    # -----------------------------------------------------
    # Completed match cannot be cancelled
    # -----------------------------------------------------

    if scheduled_match.status == "completed":

        return jsonify({
            "success": False,
            "message": "Completed match cannot be cancelled"
        }), 400

    scheduled_match.status = "cancelled"

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not cancel scheduled match"
        }), 500

    return jsonify({
        "success": True,
        "message": "Scheduled match cancelled successfully",
        "scheduled_match": scheduled_match.to_dict()
    }), 200