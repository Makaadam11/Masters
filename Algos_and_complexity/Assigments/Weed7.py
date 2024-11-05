import numpy as np

def get_unique_words(text):
    words = text.split()
    unique_words = set(words)
    return unique_words

def markov_chain(text):
    words = text.split()
    unique_words = get_unique_words(text)
    probabilities = np.zeros(len(unique_words))

    for i, word in enumerate(unique_words):
        for j in words:
            if word == j:
                probabilities[i] += 1 / len(unique_words)

    probabilities /= np.sum(probabilities)  # Normalize probabilities

    result = ""

    while len(result.split()) < 100:  # Set the desired word count here
        next_word = np.random.choice(list(unique_words), p=probabilities)
        result += next_word + " "

    return result

# Example usage:
text = "The quick brown fox jumps over the lazy dog. The lazy dog barks back. A brown cat sleeps on the windowsill. The quick cat meows loudly. Birds chirp in the morning, and the sun rises above the horizon. People gather in the park for a picnic. Kids play games, and families enjoy the sunny day. As the day progresses, clouds gather, and rain starts to fall. Everyone rushes to find shelter. After the rain, a rainbow appears in the sky, bringing smiles to the faces of those who stayed. The day ends with a beautiful sunset, and the moon and stars light up the night sky."
generated_text = markov_chain(text)
print(generated_text)
