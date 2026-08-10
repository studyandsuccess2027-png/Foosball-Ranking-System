from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.player import Player
from app.models.notification import Notification

notification_bp = Blueprint(
    "notification",
    __name__,
    url_prefix="/api/notifications"
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
# GET ALL NOTIFICATIONS
# =========================================================

@notification_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():

    current_player = get_current_player()

    if not current_player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    notifications = Notification.query.filter_by(
        player_id=current_player.id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    unread_count = Notification.query.filter_by(
        player_id=current_player.id,
        is_read=False
    ).count()

    return jsonify({
        "success": True,
        "count": len(notifications),
        "unread_count": unread_count,
        "notifications": [
            notification.to_dict()
            for notification in notifications
        ]
    }), 200


# =========================================================
# GET UNREAD NOTIFICATIONS
# =========================================================

@notification_bp.route("/unread", methods=["GET"])
@jwt_required()
def get_unread_notifications():

    current_player = get_current_player()

    if not current_player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    notifications = Notification.query.filter_by(
        player_id=current_player.id,
        is_read=False
    ).order_by(
        Notification.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "count": len(notifications),
        "notifications": [
            notification.to_dict()
            for notification in notifications
        ]
    }), 200


# =========================================================
# MARK SINGLE NOTIFICATION AS READ
# =========================================================

@notification_bp.route(
    "/<int:notification_id>/read",
    methods=["PUT"]
)
@jwt_required()
def mark_notification_read(notification_id):

    current_player = get_current_player()

    if not current_player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    notification = db.session.get(
        Notification,
        notification_id
    )

    if not notification:
        return jsonify({
            "success": False,
            "message": "Notification not found"
        }), 404

    # Only notification owner can modify it
    if notification.player_id != current_player.id:
        return jsonify({
            "success": False,
            "message": "You cannot modify this notification"
        }), 403

    if notification.is_read:
        return jsonify({
            "success": True,
            "message": "Notification is already marked as read",
            "notification": notification.to_dict()
        }), 200

    notification.is_read = True

    try:
        db.session.commit()

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not update notification"
        }), 500

    return jsonify({
        "success": True,
        "message": "Notification marked as read",
        "notification": notification.to_dict()
    }), 200


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@notification_bp.route(
    "/read-all",
    methods=["PUT"]
)
@jwt_required()
def mark_all_notifications_read():

    current_player = get_current_player()

    if not current_player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    updated_count = Notification.query.filter_by(
        player_id=current_player.id,
        is_read=False
    ).update({
        "is_read": True
    })

    try:
        db.session.commit()

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not update notifications"
        }), 500

    return jsonify({
        "success": True,
        "message": "All notifications marked as read",
        "updated_count": updated_count
    }), 200