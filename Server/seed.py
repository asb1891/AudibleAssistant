from app import app
from models import db, Prompts, Responses

with app.app_context():
    print("Deleting all existing data...")
    Prompts.query.delete()
    Responses.query.delete()
    db.session.commit()
    print("Data successfully deleted..")

    print("Database is now ready for new data from frontend interactions.")

    print("Seeding Complete")
# from app import app
# from models import db, Prompts, Responses

# with app.app_context():

#     #CREATING PROMPTS FOR THE PROMPT TABLE
#     Prompts(prompt_question="")

#     prompts=[]

#     #CREATING RESPONSES FOR THE RESPONSE TABLE
#     Responses(response_answer="")

#     responses=[]

#         print("Deleting all existing data.....")

#         Prompts.query.delete()
#         Responses.query.delete()

#         db.session.commit()
#         print("Data successfully deleted..")

#         print("Generating sample data for Prompts...")
#         prompts=[]
#         db.session.add_all(prompts)
#         db.session.commit()
#         print("Sample data for Prompts generated!")

#         print("Generating sample data for Responses....")
#         responses=[]
#         db.session.add_all(responses)
#         db.session.commit()
#         print("Sample data for Responses created!")

#         print ("Seeding Complete")