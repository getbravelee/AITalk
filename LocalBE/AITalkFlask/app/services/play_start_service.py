from datetime import datetime
from app.extensions import db
from app.models import Schedule

def create_treatment(therapist_id, child_id):
    current_date = datetime.now().date()
    start_time = datetime.now().time()

    new_treatment = Schedule(
        therapist_id=therapist_id,
        child_id=child_id,
        treatment_date=current_date,
        start_time=start_time,
        words={},
        sentence={},
        conversation=""
    )

    db.session.add(new_treatment)
    db.session.commit()

    return new_treatment.treatment_id
