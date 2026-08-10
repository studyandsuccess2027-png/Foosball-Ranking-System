from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.user import User

# Change these imports if your model filenames are different
from app.models.player import Player
from app.models.team import Team
from app.models.match import Match
from app.models.tournament import Tournament


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin"
)


# =========================================================
# ADMIN CHECK
# =========================================================

def get_current_admin():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return None

    if user.role != "admin":
        return None

    return user


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@admin_bp.route(
    "/dashboard",
    methods=["GET"]
)
@jwt_required()
def dashboard():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    total_players = Player.query.count()

    total_teams = Team.query.count()

    total_matches = Match.query.count()

    total_tournaments = Tournament.query.count()

    total_users = User.query.count()

    return jsonify({

        "success": True,

        "statistics": {

            "total_users":
                total_users,

            "total_players":
                total_players,

            "total_teams":
                total_teams,

            "total_matches":
                total_matches,

            "total_tournaments":
                total_tournaments

        }

    }), 200


# =========================================================
# GET ALL USERS
# =========================================================

@admin_bp.route(
    "/users",
    methods=["GET"]
)
@jwt_required()
def get_users():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    users = User.query.order_by(
        User.id.desc()
    ).all()

    result = []

    for user in users:

        result.append({

            "id":
                user.id,

            "username":
                user.username,

            "email":
                user.email,

            "role":
                user.role

        })

    return jsonify({

        "success": True,

        "users":
            result

    }), 200


# =========================================================
# DELETE USER
# =========================================================

@admin_bp.route(
    "/users/<int:user_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_user(user_id):

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    # Prevent admin from deleting themselves
    if user.id == admin.id:

        return jsonify({
            "success": False,
            "message": "You cannot delete your own account"
        }), 400

    db.session.delete(user)

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
            "User deleted successfully"

    }), 200


# =========================================================
# GET ALL PLAYERS
# =========================================================

@admin_bp.route(
    "/players",
    methods=["GET"]
)
@jwt_required()
def get_players():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    players = Player.query.order_by(
        Player.elo_rating.desc()
    ).all()

    result = []

    for player in players:

        result.append({

            "id":
                player.id,

            "username":
                player.username,

            "full_name":
                player.full_name,

            "elo_rating":
                player.elo_rating

        })

    return jsonify({

        "success": True,

        "players":
            result

    }), 200


# =========================================================
# DELETE PLAYER
# =========================================================

@admin_bp.route(
    "/players/<int:player_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_player(player_id):

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    player = Player.query.get(player_id)

    if not player:

        return jsonify({
            "success": False,
            "message": "Player not found"
        }), 404

    db.session.delete(player)

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
            "Player deleted successfully"

    }), 200


# =========================================================
# GET ALL TEAMS
# =========================================================

@admin_bp.route(
    "/teams",
    methods=["GET"]
)
@jwt_required()
def get_teams():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    teams = Team.query.order_by(
        Team.id.desc()
    ).all()

    result = []

    for team in teams:

        result.append({

            "id":
                team.id,

            "name":
                team.name

        })

    return jsonify({

        "success": True,

        "teams":
            result

    }), 200


# =========================================================
# GET ALL MATCHES
# =========================================================

@admin_bp.route(
    "/matches",
    methods=["GET"]
)
@jwt_required()
def get_matches():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    matches = Match.query.order_by(
        Match.id.desc()
    ).all()

    result = []

    for match in matches:

        result.append({

            "id":
                match.id,

            "player1_id":
                match.player1_id,

            "player2_id":
                match.player2_id,

            "player1_score":
                match.player1_score,

            "player2_score":
                match.player2_score,

            "winner_id":
                match.winner_id,

            "status": "Draw" if match.is_draw else (
                "Completed" if match.winner_id else "Pending"
            )

        })

    return jsonify({

        "success": True,

        "matches":
            result

    }), 200


# =========================================================
# DELETE MATCH
# =========================================================

@admin_bp.route(
    "/matches/<int:match_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_match(match_id):

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    match = Match.query.get(match_id)

    if not match:

        return jsonify({
            "success": False,
            "message": "Match not found"
        }), 404

    db.session.delete(match)

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
            "Match deleted successfully"

    }), 200


# =========================================================
# GET ALL TOURNAMENTS
# =========================================================

@admin_bp.route(
    "/tournaments",
    methods=["GET"]
)
@jwt_required()
def get_tournaments():

    admin = get_current_admin()

    if not admin:

        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    tournaments = Tournament.query.order_by(
        Tournament.id.desc()
    ).all()

    result = []

    for tournament in tournaments:

        result.append({

            "id":
                tournament.id,

            "name":
                tournament.name,

            "status":
                tournament.status,

            "format":
                tournament.format,

            "max_participants":
                tournament.max_participants

        })

    return jsonify({

        "success": True,

        "tournaments":
            result

    }), 200