from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.player import Player
from app.models.match import Match
from app.models.elo_history import EloHistory
from app.models.tournament_elo_history import TournamentEloHistory
from app.services.elo_service import (
    calculate_match_ratings
)
from app.services.ranking_service import (
    get_ranking_tier,
    get_player_streak,
    get_player_ranking_data,
    get_leaderboard
)
player_bp = Blueprint(
    "player",
    __name__,
    url_prefix="/api/player"
)
# =========================================================
# CREATE PLAYER PROFILE
# =========================================================
@player_bp.route("/create", methods=["POST"])
@jwt_required()
def create_player():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    username = data.get("username")
    full_name = data.get("full_name")
    city = data.get("city")
    country = data.get("country")
    bio = data.get("bio")
    # Required fields
    if not username or not full_name:
        return jsonify({
            "success": False,
            "message": "Username and full name are required"
        }), 400
    # Check existing profile
    existing_player = Player.query.filter_by(
        user_id=user_id
    ).first()
    if existing_player:
        return jsonify({
            "success": False,
            "message": "Player profile already exists"
        }), 409
    # Check username
    existing_username = Player.query.filter_by(
        username=username
    ).first()
    if existing_username:
        return jsonify({
            "success": False,
            "message": "Username already exists"
        }), 409
    player = Player(
        user_id=user_id,
        username=username,
        full_name=full_name,
        city=city,
        country=country,
        bio=bio,
        elo_rating=1000,
        matches_played=0,
        wins=0,
        losses=0
    )
    db.session.add(player)
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Player profile created successfully",
        "player": player.to_dict()
    }), 201
# =========================================================
# GET MY PROFILE
# =========================================================
# @player_bp.route("/me", methods=["GET"])
# @jwt_required()
# def get_my_profile():
#     user_id = get_jwt_identity()
#     player = Player.query.filter_by(
#         user_id=user_id
#     ).first()
#     if not player:
#         return jsonify({
#             "success": False,
#             "message": "Player profile not found"
#         }), 404
#     return jsonify({
#         "success": True,
#         "player": player.to_dict()
#     }), 200

# =========================================================
# GET MY PROFILE
# =========================================================

@player_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():

    user_id = get_jwt_identity()

    player = Player.query.filter_by(
        user_id=user_id
    ).first()

    if not player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    player_data = player.to_dict()

    ranking_data = get_player_ranking_data(
        player
    )

    player_data.update({
        "rank": None,
        "tier": ranking_data["tier"],
        "tier_min_elo": ranking_data["tier_min_elo"],
        "streak_type": ranking_data["streak_type"],
        "streak_count": ranking_data["streak_count"],
        "win_rate": ranking_data["win_rate"]
    })

    return jsonify({
        "success": True,
        "player": player_data
    }), 200
# =========================================================
# UPDATE PROFILE
# =========================================================
@player_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_player():
    user_id = get_jwt_identity()
    player = Player.query.filter_by(
        user_id=user_id
    ).first()
    if not player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404
    data = request.get_json() or {}
    if "full_name" in data:
        player.full_name = data["full_name"]
    if "city" in data:
        player.city = data["city"]
    if "country" in data:
        player.country = data["country"]
    if "bio" in data:
        player.bio = data["bio"]
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Profile updated successfully",
        "player": player.to_dict()
    }), 200
# =========================================================
# DELETE PROFILE
# =========================================================
@player_bp.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_player():
    user_id = get_jwt_identity()
    player = Player.query.filter_by(
        user_id=user_id
    ).first()
    if not player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404
    db.session.delete(player)
    db.session.commit()
    return jsonify({
        "success": True,
        "message": "Player profile deleted successfully"
    }), 200
# =========================================================
# SUBMIT MATCH
# =========================================================
@player_bp.route("/submit-match", methods=["POST"])
@jwt_required()
def submit_match():
    data = request.get_json() or {}
    # -----------------------------------------
    # Get data
    # -----------------------------------------
    player1_id = data.get("player1")
    player2_id = data.get("player2")
    score1 = data.get("score1")
    score2 = data.get("score2")
    # -----------------------------------------
    # Validate required fields
    # -----------------------------------------
    if (
        player1_id is None
        or player2_id is None
        or score1 is None
        or score2 is None
    ):
        return jsonify({
            "success": False,
            "message": "player1, player2, score1 and score2 are required"
        }), 400
    # -----------------------------------------
    # Convert values to integers
    # -----------------------------------------
    try:
        player1_id = int(player1_id)
        player2_id = int(player2_id)
        score1 = int(score1)
        score2 = int(score2)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Player IDs and scores must be numbers"
        }), 400
    # -----------------------------------------
    # Validate players are different
    # -----------------------------------------
    if player1_id == player2_id:
        return jsonify({
            "success": False,
            "message": "A player cannot play against themselves"
        }), 400
    # -----------------------------------------
    # Validate scores
    # -----------------------------------------
    if score1 < 0 or score2 < 0:
        return jsonify({
            "success": False,
            "message": "Scores cannot be negative"
        }), 400
    # -----------------------------------------
    # Get players
    # -----------------------------------------
    player1 = db.session.get(
        Player,
        player1_id
    )
    player2 = db.session.get(
        Player,
        player2_id
    )
    if not player1 or not player2:
        return jsonify({
            "success": False,
            "message": "One or both players not found"
        }), 404
    # -----------------------------------------
    # Determine result
    # -----------------------------------------
    if score1 > score2:
        winner_id = player1.id
        is_draw = False
    elif score2 > score1:
        winner_id = player2.id
        is_draw = False
    else:
        winner_id = None
        is_draw = True
    # -----------------------------------------
    # Save old ratings
    # -----------------------------------------
    old_rating_1 = player1.elo_rating
    old_rating_2 = player2.elo_rating
    # -----------------------------------------
    # Calculate new ratings
    # ----------------------------------------
    ratings = calculate_match_ratings(
        player1_rating=old_rating_1,
        player2_rating=old_rating_2,
        winner_id=winner_id,
        player1_id=player1.id,
        player2_id=player2.id
    )
    new_rating_1 = ratings["player1_new_rating"]
    new_rating_2 = ratings["player2_new_rating"]
    change_1 = ratings["player1_change"]
    change_2 = ratings["player2_change"]
    # -----------------------------------------
    # Update player ratings
    # -----------------------------------------
    player1.elo_rating = new_rating_1
    player2.elo_rating = new_rating_2
    # -----------------------------------------
    # Update match statistics
    # -----------------------------------------
    player1.matches_played += 1
    player2.matches_played += 1
    if winner_id == player1.id:
        player1.wins += 1
        player2.losses += 1
    elif winner_id == player2.id:
        player2.wins += 1
        player1.losses += 1
    # Draw:
    # matches_played increases,
    # wins/losses remain unchanged.
    # -----------------------------------------
    # Create match
    # -----------------------------------------
    match = Match(
        player1_id=player1.id,
        player2_id=player2.id,
        player1_score=score1,
        player2_score=score2,
        winner_id=winner_id,
        is_draw=is_draw
    )
    db.session.add(match)
    # Get match ID before creating history
    db.session.flush()
    # -----------------------------------------
    # Elo history for player 1
    # -----------------------------------------
    history1 = EloHistory(
        player_id=player1.id,
        match_id=match.id,
        old_rating=old_rating_1,
        new_rating=new_rating_1,
        rating_change=change_1
    )
    # -----------------------------------------
    # Elo history for player 2
    # -----------------------------------------
    history2 = EloHistory(
        player_id=player2.id,
        match_id=match.id,
        old_rating=old_rating_2,
        new_rating=new_rating_2,
        rating_change=change_2
    )
    db.session.add(history1)
    db.session.add(history2)
    # -----------------------------------------
    # Save everything
    # -----------------------------------------
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Could not save match"
        }), 500
    # -----------------------------------------
    # Response
    # -----------------------------------------
    return jsonify({
        "success": True,
        "message": "Match submitted successfully",
        "match": match.to_dict(),
        "ratings": {
            "player1": {
                "id": player1.id,
                "old_rating": old_rating_1,
                "new_rating": new_rating_1,
                "change": change_1
            },
            "player2": {
                "id": player2.id,
                "old_rating": old_rating_2,
                "new_rating": new_rating_2,
                "change": change_2
            }
        }
    }), 201
# =========================================================
# GET ALL MATCHES
# =========================================================
@player_bp.route("/matches", methods=["GET"])
def get_matches():
    matches = Match.query.order_by(
        Match.created_at.desc()
    ).all()
    return jsonify({
        "success": True,
        "matches": [
            match.to_dict()
            for match in matches
        ]
    }), 200
# =========================================================
# GET MY MATCHES
# =========================================================
@player_bp.route("/my-matches", methods=["GET"])
@jwt_required()
def get_my_matches():
    user_id = get_jwt_identity()
    player = Player.query.filter_by(
        user_id=user_id
    ).first()
    if not player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404
    matches = Match.query.filter(
        db.or_(
            Match.player1_id == player.id,
            Match.player2_id == player.id
        )
    ).order_by(
        Match.created_at.desc()
    ).all()
    result = []
    for match in matches:
        if match.player1_id == player.id:
            opponent = db.session.get(
                Player,
                match.player2_id
            )
            my_score = match.player1_score
            opponent_score = match.player2_score
        else:
            opponent = db.session.get(
                Player,
                match.player1_id
            )
            my_score = match.player2_score
            opponent_score = match.player1_score
        if match.is_draw:
            result_type = "DRAW"
        elif match.winner_id == player.id:
            result_type = "WIN"
        else:
            result_type = "LOSS"
        history = EloHistory.query.filter_by(
            player_id=player.id,
            match_id=match.id
        ).first()
        elo_change = (
            history.rating_change
            if history
            else 0
        )
        result.append({
            "id": match.id,
            "opponent": {
                "id": opponent.id,
                "username": opponent.username,
                "full_name": opponent.full_name
            },
            "my_score": my_score,
            "opponent_score": opponent_score,
            "result": result_type,
            "elo_change": elo_change,
            "old_rating": (
                history.old_rating
                if history
                else None
            ),
            "new_rating": (
                history.new_rating
                if history
                else None
            ),
            "created_at": match.created_at
        })
    return jsonify({
        "success": True,
        "matches": result
    }), 200

# =========================================================
# GET ELO HISTORY
# =========================================================
@player_bp.route("/elo-history", methods=["GET"])
@jwt_required()
def get_elo_history():
    """
    Return a combined Elo history for the logged-in player.

    Normal matches are read from EloHistory.
    Tournament matches are read from TournamentEloHistory.

    Both are returned through the same API so the existing
    Elo History frontend can display tournament Elo changes
    without needing a separate page.
    """

    user_id = get_jwt_identity()

    player = Player.query.filter_by(
        user_id=user_id
    ).first()

    if not player:
        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    # -----------------------------------------------------
    # NORMAL MATCH ELO HISTORY
    # -----------------------------------------------------

    normal_history = EloHistory.query.filter_by(
        player_id=player.id
    ).all()

    combined_history = []

    for item in normal_history:

        combined_history.append({
            "id": item.id,

            "type": "normal",

            "match_type": "normal",

            "match_id": item.match_id,

            "tournament_id": None,

            "tournament_match_id": None,

            "player_id": item.player_id,

            "old_rating": item.old_rating,

            "new_rating": item.new_rating,

            "rating_change": item.rating_change,

            "created_at": item.created_at
        })

    # -----------------------------------------------------
    # TOURNAMENT ELO HISTORY
    # -----------------------------------------------------

    tournament_history = TournamentEloHistory.query.filter_by(
        player_id=player.id
    ).all()

    for item in tournament_history:

        combined_history.append({
            "id": f"tournament-{item.id}",

            "type": "tournament",

            "match_type": "tournament",

            "match_id": None,

            "tournament_id": item.tournament_id,

            "tournament_match_id": (
                item.tournament_match_id
            ),

            "player_id": item.player_id,

            "old_rating": item.old_rating,

            "new_rating": item.new_rating,

            "rating_change": item.rating_change,

            "created_at": item.created_at
        })

    # -----------------------------------------------------
    # SORT BOTH TYPES TOGETHER BY DATE
    # -----------------------------------------------------

    combined_history.sort(
        key=lambda item: (
            item["created_at"]
            if item["created_at"] is not None
            else ""
        )
    )

    return jsonify({
        "success": True,
        "history": combined_history
    }), 200


# =========================================================
# SEARCH PLAYERS
# =========================================================
@player_bp.route("/search", methods=["GET"])
def search_player():
    keyword = request.args.get(
        "q",
        ""
    ).strip()
    if not keyword:
        players = Player.query.order_by(
            Player.elo_rating.desc()
        ).all()
        return jsonify({
            "success": True,
            "players": [
                player.to_dict()
                for player in players
            ]
        }), 200
    players = Player.query.filter(
        db.or_(
            Player.username.ilike(
                f"%{keyword}%"
            ),
            Player.full_name.ilike(
                f"%{keyword}%"
            ),
            Player.city.ilike(
                f"%{keyword}%"
            )
        )
    ).order_by(
        Player.elo_rating.desc()
    ).all()
    return jsonify({
        "success": True,
        "players": [
            player.to_dict()
            for player in players
        ]
    }), 200

# =========================================================
# GLOBAL LEADERBOARD
# =========================================================

@player_bp.route("/leaderboard", methods=["GET"])
def leaderboard():

    search = request.args.get(
        "search",
        default="",
        type=str
    )

    tier = request.args.get(
        "tier",
        default=None,
        type=str
    )

    sort_by = request.args.get(
        "sort",
        default="elo",
        type=str
    )

    order = request.args.get(
        "order",
        default="desc",
        type=str
    )

    # -----------------------------------------------------
    # Validate sort
    # -----------------------------------------------------

    allowed_sort = {
        "elo",
        "wins",
        "win_rate",
        "matches",
        "streak"
    }

    if sort_by not in allowed_sort:
        return jsonify({
            "success": False,
            "message": (
                "Invalid sort. Allowed values: "
                "elo, wins, win_rate, matches, streak"
            )
        }), 400

    # -----------------------------------------------------
    # Validate order
    # -----------------------------------------------------

    if order.lower() not in ["asc", "desc"]:
        return jsonify({
            "success": False,
            "message": "Order must be asc or desc"
        }), 400

    # -----------------------------------------------------
    # Validate tier
    # -----------------------------------------------------

    allowed_tiers = {
        "bronze",
        "silver",
        "gold",
        "platinum",
        "diamond"
    }

    if tier and tier.lower() not in allowed_tiers:
        return jsonify({
            "success": False,
            "message": (
                "Invalid tier. Allowed tiers: "
                "Bronze, Silver, Gold, Platinum, Diamond"
            )
        }), 400

    # -----------------------------------------------------
    # Get leaderboard
    # -----------------------------------------------------

    players = get_leaderboard(
        search=search,
        tier=tier,
        sort_by=sort_by,
        order=order
    )

    return jsonify({
        "success": True,
        "count": len(players),
        "filters": {
            "search": search,
            "tier": tier,
            "sort": sort_by,
            "order": order
        },
        "players": players
    }), 200

# =========================================================
# PLAYER RANKING DETAILS
# =========================================================

@player_bp.route("/ranking/<int:player_id>", methods=["GET"])
def player_ranking(player_id):

    player = db.session.get(
        Player,
        player_id
    )

    if not player:
        return jsonify({
            "success": False,
            "message": "Player not found"
        }), 404

    ranking_data = get_player_ranking_data(
        player
    )

    # -----------------------------------------------------
    # Find current rank
    # -----------------------------------------------------

    players = Player.query.order_by(
        Player.elo_rating.desc()
    ).all()

    rank = None

    for index, current_player in enumerate(players):

        if current_player.id == player.id:
            rank = index + 1
            break

    ranking_data["rank"] = rank

    return jsonify({
        "success": True,
        "ranking": ranking_data
    }), 200

# =========================================================
# HEAD TO HEAD
# =========================================================

@player_bp.route("/head-to-head", methods=["GET"])
def head_to_head():

    player1_id = request.args.get("player1")
    player2_id = request.args.get("player2")

    if not player1_id or not player2_id:
        return jsonify({
            "success": False,
            "message": "player1 and player2 are required"
        }), 400

    try:
        player1_id = int(player1_id)
        player2_id = int(player2_id)

    except (TypeError, ValueError):

        return jsonify({
            "success": False,
            "message": "Player IDs must be numbers"
        }), 400

    if player1_id == player2_id:

        return jsonify({
            "success": False,
            "message": "Players must be different"
        }), 400

    player1 = db.session.get(
        Player,
        player1_id
    )

    player2 = db.session.get(
        Player,
        player2_id
    )

    if not player1 or not player2:

        return jsonify({
            "success": False,
            "message": "Player not found"
        }), 404

    # -----------------------------------------------------
    # Get all matches between players
    # -----------------------------------------------------

    matches = Match.query.filter(
        db.or_(
            db.and_(
                Match.player1_id == player1_id,
                Match.player2_id == player2_id
            ),
            db.and_(
                Match.player1_id == player2_id,
                Match.player2_id == player1_id
            )
        )
    ).order_by(
        Match.created_at.desc(),
        Match.id.desc()
    ).all()

    # -----------------------------------------------------
    # Statistics
    # -----------------------------------------------------

    player1_wins = 0
    player2_wins = 0

    draws = 0

    player1_score = 0
    player2_score = 0

    match_list = []

    for match in matches:

        # Normalize scores according to selected players.

        if match.player1_id == player1_id:

            p1_score = match.player1_score
            p2_score = match.player2_score

        else:

            p1_score = match.player2_score
            p2_score = match.player1_score

        player1_score += p1_score
        player2_score += p2_score

        # Result

        if match.is_draw or match.winner_id is None:

            draws += 1

            result_for_player1 = "draw"

        elif match.winner_id == player1_id:

            player1_wins += 1

            result_for_player1 = "win"

        else:

            player2_wins += 1

            result_for_player1 = "loss"

        match_list.append({

            "id": match.id,

            "player1_score": p1_score,

            "player2_score": p2_score,

            "winner_id": match.winner_id,

            "is_draw": match.is_draw,

            "result_for_player1": result_for_player1,

            "created_at": (
                match.created_at.isoformat()
                if match.created_at
                else None
            )

        })

    # -----------------------------------------------------
    # Win rates
    # -----------------------------------------------------

    total_matches = len(matches)

    if total_matches > 0:

        player1_win_rate = round(
            (player1_wins / total_matches) * 100,
            1
        )

        player2_win_rate = round(
            (player2_wins / total_matches) * 100,
            1
        )

    else:

        player1_win_rate = 0
        player2_win_rate = 0

    # -----------------------------------------------------
    # H2H current streak
    #
    # matches are newest first
    # -----------------------------------------------------

    h2h_streak_type = "none"
    h2h_streak_count = 0

    for match in matches:

        if match.is_draw or match.winner_id is None:
            break

        if match.winner_id == player1_id:
            result = "player1"

        elif match.winner_id == player2_id:
            result = "player2"

        else:
            break

        if h2h_streak_type == "none":

            h2h_streak_type = result
            h2h_streak_count = 1

        elif h2h_streak_type == result:

            h2h_streak_count += 1

        else:

            break

    # -----------------------------------------------------
    # Ranking information
    # -----------------------------------------------------

    player1_ranking = get_player_ranking_data(
        player1
    )

    player2_ranking = get_player_ranking_data(
        player2
    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return jsonify({

        "success": True,

        "players": {

            "player1": {
                "id": player1.id,
                "username": player1.username,
                "full_name": player1.full_name,
                "elo_rating": player1.elo_rating,
                "tier": player1_ranking["tier"]
            },

            "player2": {
                "id": player2.id,
                "username": player2.username,
                "full_name": player2.full_name,
                "elo_rating": player2.elo_rating,
                "tier": player2_ranking["tier"]
            }

        },

        "statistics": {

            "matches_played": total_matches,

            "player1_wins": player1_wins,

            "player2_wins": player2_wins,

            "draws": draws,

            "player1_win_rate": player1_win_rate,

            "player2_win_rate": player2_win_rate,

            "player1_score": player1_score,

            "player2_score": player2_score

        },

        "streak": {

            "type": h2h_streak_type,

            "count": h2h_streak_count

        },

        "last_five_matches": match_list[:5],

        "matches": match_list

    }), 200