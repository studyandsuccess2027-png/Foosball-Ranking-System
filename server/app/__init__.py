from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db
from app.extensions import bcrypt
from app.extensions import jwt
from app.routes.player import player_bp
from app.routes.auth import auth_bp
from app.routes.team import team_bp
from app.routes.tournament import tournament_bp
from app.routes.statistics import statistics_bp
from app.routes.admin import admin_bp
from app.routes.scheduling import scheduling_bp
from app.routes.invitation import invitation_bp
from app.routes.notification import notification_bp
from app.models.user import User
from app.models.player import Player
from app.models.match import Match
from app.models.elo_history import EloHistory
from app.models.team import Team, TeamMember
from app.models.tournament import (
    Tournament,
    TournamentParticipant,
    TournamentMatch
)

from app.models.scheduled_match import ScheduledMatch
from app.models.notification import (
    MatchInvitation,
    Notification
)
def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(player_bp)
    app.register_blueprint(team_bp)
    app.register_blueprint(tournament_bp)
    app.register_blueprint(statistics_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(scheduling_bp)
    app.register_blueprint(invitation_bp)
    app.register_blueprint(notification_bp)
    with app.app_context():
        db.create_all()

    return app