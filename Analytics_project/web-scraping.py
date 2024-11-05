import requests
from bs4 import BeautifulSoup
import csv

# Adres URL do scrapowania danych
url = 'https://git.arts.ac.uk/pages/23038800/23038800.github.io/dataset.html'

# Wysłanie zapytania do serwera i pobranie zawartości strony
response = requests.get(url)

# Parsowanie zawartości strony za pomocą BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Znalezienie tabeli na stronie
table = soup.find('table')

# Sprawdzenie czy tabela została znaleziona
if table:
    # Otwarcie pliku CSV do zapisu
    with open('web-scraped_data.csv', 'w', newline='') as csvfile:
        # Utworzenie obiektu writera CSV
        csv_writer = csv.writer(csvfile)
        
        # Zapisanie danych wiersz po wierszu
        for row in table.find_all('tr'):
            # Wyodrębnienie danych z każdej komórki w wierszu
            data = [cell.get_text(strip=True) for cell in row.find_all('td')]
            # Zapisanie danych do pliku CSV
            csv_writer.writerow(data)
    
    print("Dane zostały zapisane do pliku web-scraped_data.csv.")
else:
    print("Nie znaleziono tabeli na stronie.")
