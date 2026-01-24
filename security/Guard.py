def allowed(action):
    blocked = ["record_secret", "private_data"]
    return action not in blocked
