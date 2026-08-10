from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from app.extensions import db
from app.extensions import bcrypt

from app.models.user import User

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# ----------------------------------------------------
# Register
# ----------------------------------------------------
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Registration successful"
    }), 201


# ----------------------------------------------------
# Login
# ----------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and Password required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if user is None:

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    password_correct = bcrypt.check_password_hash(
        user.password,
        password
    )

    if not password_correct:

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({

        "success": True,

        "token": access_token,

        "user": {

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role

        }

    }), 200


# ----------------------------------------------------
# Logged In User
# ----------------------------------------------------
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:

        return jsonify({

            "success": False,

            "message": "User not found"

        }), 404

    return jsonify({

        "success": True,

        "user": user.to_dict()

    })


# ----------------------------------------------------
# Update Profile
# ----------------------------------------------------
@auth_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    data = request.get_json()

    name = data.get("name")

    if name:
        user.name = name

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile Updated",
        "user": user.to_dict()
    })


# ----------------------------------------------------
# Change Password
# ----------------------------------------------------
@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    data = request.get_json()

    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not bcrypt.check_password_hash(
        user.password,
        old_password
    ):

        return jsonify({
            "success": False,
            "message": "Old password incorrect"
        }), 401

    hashed = bcrypt.generate_password_hash(
        new_password
    ).decode("utf-8")

    user.password = hashed

    db.session.commit()

    return jsonify({

        "success": True,

        "message": "Password Changed"

    })