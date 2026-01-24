class MemoryStore:
    def __init__(self):
        self.short = []
        self.long = []
        self.journal = []

    def remember(self, text):
        self.short.append(text)

    def learn(self, fact):
        self.long.append(fact)

    def reflect(self, entry):
        self.journal.append(entry)
