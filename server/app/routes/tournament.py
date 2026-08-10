from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app import db

from app.models.player import Player

from app.models.tournament import (
    Tournament,
    TournamentParticipant,
    TournamentMatch
)

from app.models.tournament_elo_history import (
    TournamentEloHistory
)

from app.services.elo_service import (
    calculate_tournament_ratings
)
from app.models.match import Match
from app.models.elo_history import EloHistory

from app.services.elo_service import (
    calculate_match_ratings
)

tournament_bp = Blueprint(
    "tournament",
    __name__,
    url_prefix="/api/tournaments"
)


# =========================================================
# Helper
# =========================================================

def get_current_player():

    user_id = get_jwt_identity()

    return Player.query.filter_by(
        user_id=user_id
    ).first()


# =========================================================
# TOURNAMENT BRACKET HELPERS
# =========================================================

def get_next_power_of_two(number):

    power = 1

    while power < number:
        power *= 2

    return power


def get_total_rounds(number_of_players):

    bracket_size = get_next_power_of_two(
        number_of_players
    )

    rounds = 0

    while bracket_size > 1:

        bracket_size //= 2
        rounds += 1

    return rounds


def advance_winner_to_next_round(match):
    """
    Move the winner of the current match
    into the correct slot of the next match.
    """

    if not match.winner_id:
        return

    # No next match means this is the final.
    if not match.next_match_id:
        return

    next_match = db.session.get(
        TournamentMatch,
        match.next_match_id
    )

    if not next_match:
        return

    if match.next_slot == "player1":

        next_match.player1_id = (
            match.winner_id
        )

    elif match.next_slot == "player2":

        next_match.player2_id = (
            match.winner_id
        )

    # Both players are now available.
    if (
        next_match.player1_id
        and
        next_match.player2_id
    ):

        next_match.status = "scheduled"


def complete_tournament_if_final(match):
    """
    If the completed match is the final,
    mark tournament as completed and save
    the tournament winner.
    """

    if match.next_match_id:
        return False

    if not match.winner_id:
        return False

    tournament = db.session.get(
        Tournament,
        match.tournament_id
    )

    if not tournament:
        return False

    tournament.winner_id = match.winner_id
    tournament.status = "completed"

    return True


def process_bye_match(match):
    """
    Automatically advance a bye winner.

    This is useful when participant count is
    not an exact power of two, e.g. 6 players,
    10 players, etc.
    """

    if match.status != "bye":
        return

    if not match.player1_id:
        return

    match.winner_id = match.player1_id
    match.status = "completed"

    participant = TournamentParticipant.query.filter_by(
        tournament_id=match.tournament_id,
        player_id=match.player1_id
    ).first()

    if participant:
        participant.wins += 1

    advance_winner_to_next_round(match)


# =========================================================
# TOURNAMENT ELO HELPER
# =========================================================

def apply_tournament_elo(match):
    """
    Apply Elo rating changes to both players of the
    completed tournament match.

    IMPORTANT:
    This is called for EVERY completed tournament match,
    not only the final.

    Every tournament match creates two
    TournamentEloHistory records.
    """

    if not match.winner_id:
        return None

    if not match.player1_id or not match.player2_id:
        return None

    player1 = db.session.get(
        Player,
        match.player1_id
    )

    player2 = db.session.get(
        Player,
        match.player2_id
    )

    if not player1 or not player2:
        raise ValueError(
            "Tournament players not found"
        )

    old_rating_1 = player1.elo_rating
    old_rating_2 = player2.elo_rating

    ratings = calculate_tournament_ratings(
        player1_rating=old_rating_1,
        player2_rating=old_rating_2,
        winner_id=match.winner_id,
        player1_id=player1.id,
        player2_id=player2.id
    )

    player1.elo_rating = ratings[
        "player1_new_rating"
    ]

    player2.elo_rating = ratings[
        "player2_new_rating"
    ]

    history1 = TournamentEloHistory(
        tournament_id=match.tournament_id,
        tournament_match_id=match.id,
        player_id=player1.id,
        old_rating=old_rating_1,
        new_rating=ratings[
            "player1_new_rating"
        ],
        rating_change=ratings[
            "player1_change"
        ]
    )

    history2 = TournamentEloHistory(
        tournament_id=match.tournament_id,
        tournament_match_id=match.id,
        player_id=player2.id,
        old_rating=old_rating_2,
        new_rating=ratings[
            "player2_new_rating"
        ],
        rating_change=ratings[
            "player2_change"
        ]
    )

    db.session.add(history1)
    db.session.add(history2)

    return {
        "player1": {
            "id": player1.id,
            "old_rating": old_rating_1,
            "new_rating": ratings[
                "player1_new_rating"
            ],
            "change": ratings[
                "player1_change"
            ]
        },
        "player2": {
            "id": player2.id,
            "old_rating": old_rating_2,
            "new_rating": ratings[
                "player2_new_rating"
            ],
            "change": ratings[
                "player2_change"
            ]
        }
    }


# =========================================================
# CREATE TOURNAMENT
# =========================================================

@tournament_bp.route(
    "/create",
    methods=["POST"]
)
@jwt_required()
def create_tournament():

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

    tournament_format = data.get(
        "format",
        "single_elimination"
    )

    max_participants = data.get(
        "max_participants",
        16
    )

    if not name:

        return jsonify({
            "success": False,
            "message": "Tournament name is required"
        }), 400

    allowed_formats = [
        "single_elimination",
        "round_robin"
    ]

    if tournament_format not in allowed_formats:

        return jsonify({
            "success": False,
            "message": "Invalid tournament format"
        }), 400

    try:

        max_participants = int(
            max_participants
        )

    except (ValueError, TypeError):

        return jsonify({
            "success": False,
            "message": "Invalid participant limit"
        }), 400

    if max_participants < 2:

        return jsonify({
            "success": False,
            "message":
                "At least 2 participants are required"
        }), 400

    tournament = Tournament(

        name=name.strip(),

        description=description,

        city=city,

        format=tournament_format,

        max_participants=max_participants,

        created_by=player.id

    )

    db.session.add(tournament)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Tournament created successfully",

        "tournament": tournament.to_dict()

    }), 201


# =========================================================
# LIST TOURNAMENTS
# =========================================================

@tournament_bp.route(
    "",
    methods=["GET"]
)
@jwt_required()
def get_tournaments():

    tournaments = Tournament.query.order_by(
        Tournament.created_at.desc()
    ).all()

    return jsonify({

        "success": True,

        "tournaments": [
            tournament.to_dict()
            for tournament in tournaments
        ]

    }), 200


# =========================================================
# GET TOURNAMENT DETAILS
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>",
    methods=["GET"]
)
@jwt_required()
def get_tournament(tournament_id):

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    participants = [

        participant.to_dict()

        for participant
        in tournament.participants

    ]

    matches = [

        match.to_dict()

        for match
        in tournament.matches

    ]

    return jsonify({

        "success": True,

        "tournament": {

            **tournament.to_dict(),

            "participants": participants,

            "matches": matches,

            "participant_count":
                len(participants)

        }

    }), 200


# =========================================================
# JOIN TOURNAMENT
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>/join",
    methods=["POST"]
)
@jwt_required()
def join_tournament(tournament_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    if tournament.status != "upcoming":

        return jsonify({

            "success": False,

            "message":
                "Tournament registration is closed"

        }), 400

    participant_count = TournamentParticipant.query.filter_by(
        tournament_id=tournament.id
    ).count()

    if participant_count >= tournament.max_participants:

        return jsonify({

            "success": False,

            "message": "Tournament is full"

        }), 400

    existing = TournamentParticipant.query.filter_by(

        tournament_id=tournament.id,

        player_id=player.id

    ).first()

    if existing:

        return jsonify({

            "success": False,

            "message": "You already joined this tournament"

        }), 409

    participant = TournamentParticipant(

        tournament_id=tournament.id,

        player_id=player.id

    )

    db.session.add(participant)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Joined tournament successfully",

        "participant":
            participant.to_dict()

    }), 201


# =========================================================
# LEAVE TOURNAMENT
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>/leave",
    methods=["POST"]
)
@jwt_required()
def leave_tournament(tournament_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    participant = TournamentParticipant.query.filter_by(

        tournament_id=tournament_id,

        player_id=player.id

    ).first()

    if not participant:

        return jsonify({

            "success": False,

            "message": "You are not registered"

        }), 404

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    if tournament.status != "upcoming":

        return jsonify({

            "success": False,

            "message":
                "You cannot leave an active tournament"

        }), 400

    db.session.delete(participant)

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Left tournament successfully"

    }), 200


# =========================================================
# START TOURNAMENT
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>/start",
    methods=["POST"]
)
@jwt_required()
def start_tournament(tournament_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    if tournament.created_by != player.id:

        return jsonify({

            "success": False,

            "message":
                "Only tournament creator can start it"

        }), 403

    if tournament.status != "upcoming":

        return jsonify({

            "success": False,

            "message":
                "Tournament has already started"

        }), 400

    participants = TournamentParticipant.query.filter_by(

        tournament_id=tournament.id

    ).all()

    if len(participants) < 2:

        return jsonify({

            "success": False,

            "message":
                "At least 2 participants are required"

        }), 400

    tournament.status = "active"

    # Random/simple seeding
    for index, participant in enumerate(
        participants
    ):

        participant.seed = index + 1

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Tournament started successfully",

        "tournament":
            tournament.to_dict()

    }), 200


# =========================================================
# GENERATE SINGLE ELIMINATION BRACKET
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>/generate-bracket",
    methods=["POST"]
)
@jwt_required()
def generate_bracket(tournament_id):

    player = get_current_player()

    if not player:

        return jsonify({
            "success": False,
            "message": "Player profile not found"
        }), 404

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    if tournament.created_by != player.id:

        return jsonify({

            "success": False,

            "message":
                "Only tournament creator can generate bracket"

        }), 403

    if tournament.format != "single_elimination":

        return jsonify({

            "success": False,

            "message":
                "Bracket generation is only for single elimination"

        }), 400

    if tournament.status != "active":

        return jsonify({

            "success": False,

            "message":
                "Tournament must be active before generating bracket"

        }), 400

    existing_matches = TournamentMatch.query.filter_by(

        tournament_id=tournament.id

    ).count()

    if existing_matches > 0:

        return jsonify({

            "success": False,

            "message":
                "Bracket has already been generated"

        }), 409

    participants = TournamentParticipant.query.filter_by(

        tournament_id=tournament.id

    ).order_by(

        TournamentParticipant.seed.asc()

    ).all()

    if len(participants) < 2:

        return jsonify({

            "success": False,

            "message":
                "Not enough participants"

        }), 400

    participant_count = len(participants)

    bracket_size = get_next_power_of_two(
        participant_count
    )

    total_rounds = get_total_rounds(
        participant_count
    )

    # -----------------------------------------------------
    # CREATE ALL MATCHES FIRST
    # -----------------------------------------------------

    rounds = {}

    for round_number in range(
        1,
        total_rounds + 1
    ):

        matches_in_round = (
            bracket_size // (2 ** round_number)
        )

        rounds[round_number] = []

        for match_number in range(
            1,
            matches_in_round + 1
        ):

            match = TournamentMatch(

                tournament_id=tournament.id,

                round_number=round_number,

                match_number=match_number,

                status="scheduled"

            )

            db.session.add(match)

            rounds[round_number].append(
                match
            )

    # IDs are required before connecting
    # matches to their next matches.
    db.session.flush()

    # -----------------------------------------------------
    # CONNECT EACH MATCH TO NEXT ROUND
    # -----------------------------------------------------

    for round_number in range(
        1,
        total_rounds
    ):

        current_round = rounds[
            round_number
        ]

        next_round = rounds[
            round_number + 1
        ]

        for index, current_match in enumerate(
            current_round
        ):

            next_match = next_round[
                index // 2
            ]

            current_match.next_match_id = (
                next_match.id
            )

            if index % 2 == 0:

                current_match.next_slot = (
                    "player1"
                )

            else:

                current_match.next_slot = (
                    "player2"
                )

    # -----------------------------------------------------
    # ASSIGN PLAYERS TO ROUND 1
    # -----------------------------------------------------

    first_round = rounds[1]

    for index, match in enumerate(
        first_round
    ):

        participant_index = index * 2

        player1 = participants[
            participant_index
        ]

        match.player1_id = (
            player1.player_id
        )

        # Second player exists
        if (
            participant_index + 1
            < participant_count
        ):

            player2 = participants[
                participant_index + 1
            ]

            match.player2_id = (
                player2.player_id
            )

            match.status = "scheduled"

        # Bye
        else:

            match.status = "bye"

    # -----------------------------------------------------
    # PROCESS ROUND 1 BYES
    # -----------------------------------------------------

    for match in first_round:

        if match.status == "bye":

            process_bye_match(
                match
            )

    # -----------------------------------------------------
    # PROCESS AUTOMATIC BYES IN LATER ROUNDS
    # -----------------------------------------------------

    for round_number in range(
        2,
        total_rounds + 1
    ):

        current_round = rounds[
            round_number
        ]

        for match in current_round:

            # If only one player has arrived,
            # automatically advance that player.
            if (
                match.player1_id
                and
                not match.player2_id
            ):

                match.status = "bye"

                process_bye_match(
                    match
                )

            elif (
                match.player2_id
                and
                not match.player1_id
            ):

                # Move player2 to player1 slot
                match.player1_id = (
                    match.player2_id
                )

                match.player2_id = None

                match.status = "bye"

                process_bye_match(
                    match
                )

    db.session.commit()

    all_matches = TournamentMatch.query.filter_by(
        tournament_id=tournament.id
    ).order_by(
        TournamentMatch.round_number.asc(),
        TournamentMatch.match_number.asc()
    ).all()

    return jsonify({

        "success": True,

        "message":
            "Tournament bracket generated",

        "total_rounds":
            total_rounds,

        "bracket_size":
            bracket_size,

        "matches": [

            match.to_dict()

            for match in all_matches

        ]

    }), 201


# =========================================================
# SUBMIT TOURNAMENT MATCH RESULT
# =========================================================

@tournament_bp.route(
    "/matches/<int:match_id>/result",
    methods=["POST"]
)
@jwt_required()
def submit_match_result(match_id):

    player = get_current_player()

    if not player:

        return jsonify({

            "success": False,

            "message": "Player profile not found"

        }), 404

    match = db.session.get(
        TournamentMatch,
        match_id
    )

    if not match:

        return jsonify({

            "success": False,

            "message": "Tournament match not found"

        }), 404

    if match.status == "completed":

        return jsonify({

            "success": False,

            "message": "Match result already submitted"

        }), 400

    # Bye matches should never accept
    # a manually submitted score.
    if match.status == "bye":

        return jsonify({

            "success": False,

            "message":
                "Bye match is automatically completed"

        }), 400

    if not match.player1_id or not match.player2_id:

        return jsonify({

            "success": False,

            "message":
                "This match is not ready yet"

        }), 400

    if player.id not in [
        match.player1_id,
        match.player2_id
    ]:

        return jsonify({

            "success": False,

            "message":
                "You are not a participant in this match"

        }), 403

    data = request.get_json() or {}

    try:

        player1_score = int(
            data.get("player1_score")
        )

        player2_score = int(
            data.get("player2_score")
        )

    except (ValueError, TypeError):

        return jsonify({

            "success": False,

            "message": "Invalid score"

        }), 400

    if player1_score < 0 or player2_score < 0:

        return jsonify({

            "success": False,

            "message": "Score cannot be negative"

        }), 400

    if player1_score == player2_score:

        return jsonify({

            "success": False,

            "message":
                "Tournament elimination matches cannot be draws"

        }), 400

    match.player1_score = player1_score

    match.player2_score = player2_score

    if player1_score > player2_score:

        match.winner_id = match.player1_id

    else:

        match.winner_id = match.player2_id

    match.status = "completed"

    # -----------------------------------------------------
    # APPLY ELO TO EVERY COMPLETED TOURNAMENT MATCH
    # -----------------------------------------------------

    try:

        elo_result = apply_tournament_elo(
            match
        )

    except Exception as e:

        db.session.rollback()

        print(
            "Tournament Elo update error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Tournament result could not update Elo",

            "error": str(e)

        }), 500

    # -----------------------------------------------------
    # UPDATE PARTICIPANT STATS
    # -----------------------------------------------------

    winner = TournamentParticipant.query.filter_by(

        tournament_id=match.tournament_id,

        player_id=match.winner_id

    ).first()

    loser_id = (

        match.player2_id

        if match.winner_id == match.player1_id

        else match.player1_id

    )

    loser = TournamentParticipant.query.filter_by(

        tournament_id=match.tournament_id,

        player_id=loser_id

    ).first()

    if winner:

        winner.wins += 1

        winner.points += 3

    if loser:

        loser.losses += 1
        loser.eliminated = True

    # -----------------------------------------------------
    # ADVANCE WINNER
    # -----------------------------------------------------

    advance_winner_to_next_round(
        match
    )

    # -----------------------------------------------------
    # CHECK FINAL
    # -----------------------------------------------------

    tournament_completed = (
        complete_tournament_if_final(
            match
        )
    )

    db.session.commit()

    return jsonify({

        "success": True,

        "message":
            "Tournament match result recorded and Elo updated",

        "match":
            match.to_dict(),

        "tournament_completed":
            tournament_completed,

        "tournament_winner_id":
            match.winner_id
            if tournament_completed
            else None,

        "elo":
            elo_result

    }), 200


# =========================================================
# TOURNAMENT STANDINGS
# =========================================================

@tournament_bp.route(
    "/<int:tournament_id>/standings",
    methods=["GET"]
)
@jwt_required()
def tournament_standings(tournament_id):

    tournament = db.session.get(
        Tournament,
        tournament_id
    )

    if not tournament:

        return jsonify({

            "success": False,

            "message": "Tournament not found"

        }), 404

    participants = TournamentParticipant.query.filter_by(

        tournament_id=tournament.id

    ).order_by(

        TournamentParticipant.points.desc(),

        TournamentParticipant.wins.desc()

    ).all()

    return jsonify({

        "success": True,

        "standings": [

            {
                "rank": index + 1,
                **participant.to_dict()
            }

            for index, participant
            in enumerate(participants)

        ]

    }), 200