from app.models.child_model import Child

def get_all_children():
    children = Child.query.all()
    return [
        {
            "child_id": child.child_id,
            "therapist_id": child.therapist_id,
            "child_name": child.child_name,
            "profile_image": child.profile_image,
            "disability_type": child.disability_type,
            "age": child.age
        }
        for child in children
    ]
