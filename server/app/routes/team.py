from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.player import Player
from app.models.team import Team, TeamMember


team_bp = Blueprint(
    "team",
    __name__,
    url_prefix="/api/team"
)


# =========================================================
# Helper
# =========================================================

def get_current_player():

    user_id = get_jwt_identity()

    player = Player.query.filter_by(
        user_id=user_id
    ).first()

    return player


# =========================================================
# CREATE TEAM
# =========================================================

@team_bp.route(
    "/create",
    methods=["POST"]
)
@jwt_required()
def create_team():

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")
    city = data.get("city")

    if not name:

        return jsonify({

            "success": False,

            "message": "Team name is required"

        }), 400

    name = name.strip()

    if not name:

        return jsonify({

            "success": False,

            "message": "Team name cannot be empty"

        }), 400

    existing_team = Team.query.filter_by(
        name=name
    ).first()

    if existing_team:

        return jsonify({

            "success": False,

            "message": "A team with this name already exists"

        }), 409

    team = Team(

        name=name,

        description=description,

        city=city,

        owner_id=player.id

    )

    db.session.add(team)

    db.session.flush()

    # Owner automatically becomes a team member

    owner_member = TeamMember(

        team_id=team.id,

        player_id=player.id,

        role="owner"

    )

    db.session.add(owner_member)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Team created successfully",

        "team": team.to_dict()

    }), 201


# =========================================================
# GET MY TEAMS
# =========================================================

@team_bp.route(
    "/my-teams",
    methods=["GET"]
)
@jwt_required()
def get_my_teams():

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    memberships = TeamMember.query.filter_by(
        player_id=player.id
    ).all()

    teams = []

    for membership in memberships:

        team = membership.team

        teams.append({

            **team.to_dict(),

            "role": membership.role,

            "member_count": len(
                team.members
            )

        })

    return jsonify({

        "success": True,

        "teams": teams

    }), 200


# =========================================================
# GET TEAM DETAILS
# =========================================================

@team_bp.route(
    "/<int:team_id>",
    methods=["GET"]
)
@jwt_required()
def get_team(team_id):

    team = db.session.get(
        Team,
        team_id
    )

    if not team:

        return jsonify({

            "success": False,

            "message": "Team not found"

        }), 404

    members = []

    for member in team.members:

        members.append(
            member.to_dict()
        )

    return jsonify({

        "success": True,

        "team": {

            **team.to_dict(),

            "members": members,

            "member_count": len(members)

        }

    }), 200


# =========================================================
# ADD PLAYER TO TEAM
# =========================================================

@team_bp.route(
    "/<int:team_id>/members",
    methods=["POST"]
)
@jwt_required()
def add_member(team_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    team = db.session.get(
        Team,
        team_id
    )

    if not team:

        return jsonify({

            "success": False,

            "message": "Team not found"

        }), 404

    # Only owner can add members

    if team.owner_id != player.id:

        return jsonify({

            "success": False,

            "message": "Only the team owner can add members"

        }), 403

    data = request.get_json() or {}

    player_id = data.get("player_id")

    if not player_id:

        return jsonify({

            "success": False,

            "message": "player_id is required"

        }), 400

    target_player = db.session.get(
        Player,
        player_id
    )

    if not target_player:

        return jsonify({

            "success": False,

            "message": "Player not found"

        }), 404

    existing_member = TeamMember.query.filter_by(

        team_id=team.id,

        player_id=target_player.id

    ).first()

    if existing_member:

        return jsonify({

            "success": False,

            "message": "Player is already a team member"

        }), 409

    member = TeamMember(

        team_id=team.id,

        player_id=target_player.id,

        role="member"

    )

    db.session.add(member)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Player added to team",

        "member": member.to_dict()

    }), 201


# =========================================================
# REMOVE PLAYER FROM TEAM
# =========================================================

@team_bp.route(
    "/<int:team_id>/members/<int:player_id>",
    methods=["DELETE"]
)
@jwt_required()
def remove_member(
    team_id,
    player_id
):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    team = db.session.get(
        Team,
        team_id
    )

    if not team:

        return jsonify({

            "success": False,

            "message": "Team not found"

        }), 404

    if team.owner_id != player.id:

        return jsonify({

            "success": False,

            "message": "Only the team owner can remove members"

        }), 403

    if player_id == team.owner_id:

        return jsonify({

            "success": False,

            "message": "Team owner cannot be removed"

        }), 400

    member = TeamMember.query.filter_by(

        team_id=team_id,

        player_id=player_id

    ).first()

    if not member:

        return jsonify({

            "success": False,

            "message": "Player is not a member of this team"

        }), 404

    db.session.delete(member)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Player removed from team"

    }), 200


# =========================================================
# LEAVE TEAM
# =========================================================

@team_bp.route(
    "/<int:team_id>/leave",
    methods=["POST"]
)
@jwt_required()
def leave_team(team_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    team = db.session.get(
        Team,
        team_id
    )

    if not team:

        return jsonify({

            "success": False,

            "message": "Team not found"

        }), 404

    if team.owner_id == player.id:

        return jsonify({

            "success": False,

            "message": "Team owner cannot leave. Delete the team instead."

        }), 400

    membership = TeamMember.query.filter_by(

        team_id=team_id,

        player_id=player.id

    ).first()

    if not membership:

        return jsonify({

            "success": False,

            "message": "You are not a member of this team"

        }), 404

    db.session.delete(membership)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "You left the team"

    }), 200


# =========================================================
# DELETE TEAM
# =========================================================

@team_bp.route(
    "/<int:team_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_team(team_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    team = db.session.get(
        Team,
        team_id
    )

    if not team:

        return jsonify({

            "success": False,

            "message": "Team not found"

        }), 404

    if team.owner_id != player.id:

        return jsonify({

            "success": False,

            "message": "Only the team owner can delete the team"

        }), 403

    db.session.delete(team)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Team deleted successfully"

    }), 200