from app.extensions import db
class Player(db.Model):
    __tablename__ = "players"
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        unique=True
    )
    username = db.Column(
        db.String(80),
        unique=True,
        nullable=False
    )
    full_name = db.Column(
        db.String(120),
        nullable=False
    )
    city = db.Column(
        db.String(80)
    )
    country = db.Column(
        db.String(80)
    )
    bio = db.Column(
        db.Text
    )
    avatar = db.Column(
        db.String(255)
    )
    elo_rating = db.Column(
        db.Integer,
        default=1000
    )
    matches_played = db.Column(
        db.Integer,
        default=0
    )
    wins = db.Column(
        db.Integer,
        default=0
    )
    losses = db.Column(
        db.Integer,
        default=0
    )
    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
    user = db.relationship(
        "User",
        backref="player",
        lazy=True
    )
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.username,
            "full_name": self.full_name,
            "city": self.city,
            "country": self.country,
            "bio": self.bio,
            "avatar": self.avatar,
            "elo_rating": self.elo_rating,
            "matches_played": self.matches_played,
            "wins": self.wins,
            "losses": self.losses
        }