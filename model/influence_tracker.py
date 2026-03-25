import json
import os

FILE_NAME = "scores.json"

# Load data
if os.path.exists(FILE_NAME):
    with open(FILE_NAME, "r") as f:
        data = json.load(f)

    # auto-correct old JSON format
    if "datas" not in data or "scores" not in data:
        data = {
            "datas": [],
            "scores": {}
        }
else:
    data = {
        "datas": [],
        "scores": {}
    }

def save():
    with open(FILE_NAME, "w") as f:
        json.dump(data, f, indent=4)

def add_data():
    name = input("Enter data name: ").strip().lower()

    if name in data["datas"]:
        print("This data already exists.")
        return

    data["datas"].append(name)
    data["scores"][name] = 0

    save()

def show_datas():
    print("\nList of data:\n")
    for i, d in enumerate(data["datas"], 1):
        print(f"{i}. {d}")
    print()

def add_influence():
    if len(data["datas"]) < 2:
        print("At least 2 data items are needed.")
        return

    show_datas()

    source = int(input("Number of the data that influences: ")) - 1
    target = int(input("Number of the data being influenced: ")) - 1

    print("\nInfluence level:")
    print("1 = very low")
    print("2 = low")
    print("3 = medium")
    print("4 = high")
    print("5 = very high")

    level = int(input("Choose (1-5): "))

    source_name = data["datas"][source]

    data["scores"][source_name] += level

    save()

def show_ranking():
    ranking = sorted(data["scores"].items(), key=lambda x: x[1], reverse=True)

    print("\nCurrent ranking:\n")

    for i, (name, score) in enumerate(ranking, 1):
        print(f"{i}. {name} : {score}")

    print()

def clear_scores():
    confirm = input("Reset all scores to 0? (yes/no): ")

    if confirm.lower() == "yes":
        for d in data["scores"]:
            data["scores"][d] = 0

        save()
        print("All scores have been reset.")

while True:
    print("\n------ Influence Tracker ------")

    show_ranking()

    print("1 - Add a data")
    print("2 - Add an influence")
    print("3 - Show list of data")
    print("4 - Reset ranking")
    print("5 - Quit")

    choice = input("\nChoice: ")

    if choice == "1":
        add_data()

    elif choice == "2":
        add_influence()

    elif choice == "3":
        show_datas()

    elif choice == "4":
        clear_scores()

    elif choice == "5":
        break