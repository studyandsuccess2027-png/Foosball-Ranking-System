from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

email = input("Admin user ka email enter karo: ").strip()

with app.app_context():

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        print("❌ User nahi mila.")

    else:

        user.role = "admin"

        db.session.commit()

        print("✅ User successfully admin ban gaya!")
        print("Name:", user.name)
        print("Email:", user.email)
        print("Role:", user.role)