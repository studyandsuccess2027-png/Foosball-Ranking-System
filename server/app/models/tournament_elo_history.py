from app.extensions import db
class TournamentEloHistory(db.Model):
    __tablename__ = "tournament_elo_history"
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    tournament_id = db.Column(
        db.Integer,
        db.ForeignKey("tournaments.id"),
        nullable=False
    )
    tournament_match_id = db.Column(
        db.Integer,
        db.ForeignKey("tournament_matches.id"),
        nullable=False
    )
    player_id = db.Column(
        db.Integer,
        db.ForeignKey("players.id"),
        nullable=False
    )
    old_rating = db.Column(
        db.Integer,
        nullable=False
    )
    new_rating = db.Column(
        db.Integer,
        nullable=False
    )
    rating_change = db.Column(
        db.Integer,
        nullable=False
    )
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
    def to_dict(self):
        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "tournament_match_id":
                self.tournament_match_id,
            "player_id": self.player_id,
            "old_rating":
                self.old_rating,
            "new_rating":
                self.new_rating,
            "rating_change":
                self.rating_change,
            "created_at":
                self.created_at
        }