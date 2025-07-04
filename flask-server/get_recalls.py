#
# Automated scraper to pull last 6 months' recalls from Medsafe NZ.
# Uses a headless chrome instance to avoid scraper checks, can be
# altered to scrape more/less frequently by adjusting timedelta.
# Rewriting using BeautifulSoup could make data formatting more
# robust, but works well as-is.
#

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from datetime import datetime, timedelta
import re
from selenium.common.exceptions import (
    ElementNotInteractableException,
    NoSuchElementException,
    WebDriverException
)

def get_recalls():
    today = datetime.today()
    six_months = today - timedelta(days=180)

    formatted_today = today.strftime('%d %b %Y').lstrip('0')
    formatted_minus_six_months = six_months.strftime('%d %b %Y').lstrip('0')

    options = Options()
    options.add_argument("--headless")

    try:
        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(5)
        driver.get("https://www.medsafe.govt.nz/hot/Recalls/RecallSearch.asp")

        date_from = driver.find_element(By.ID, "txtDateFrom")
        date_to = driver.find_element(By.ID, 'txtDateTo')
        medicine = driver.find_element(By.ID, 'optMedicine')
        search_button = driver.find_element(By.NAME, 'cmdSearch')

        date_from.clear()
        date_from.send_keys(f"{formatted_today}")
        date_to.send_keys(f"{formatted_minus_six_months}")

        try:
            medicine.click()
        except ElementNotInteractableException:
            print("Medicine option not interactable — skipping click.")

        search_button.click()

        results_table = driver.find_element(By.XPATH, '//*[@id="content-area"]/table')
        results = results_table.get_attribute('outerHTML')
        return results

    except (WebDriverException, NoSuchElementException, ElementNotInteractableException) as e:
        print(f"Recall scraping error: {e}")
        return None

    finally:
        try:
            driver.quit()
        except:
            pass

def format_recalls(HTML_data):
    split_table = re.split('(<[a-zA-Z=" 0-9/.?]*>)', HTML_data)
    remove_tags = ['<table border="1">', '<tbody>', '<tr>', '<th>', '<td>', '<a>', ', ', '</tbody>', '</tr>', '</th>', '</td>', '</a>', '</table>', '', 'Date', 'Brand Name', 'Recall Action']
    
    cleaned_table = []
    for i in split_table:
        if i not in remove_tags:
            cleaned_table.append(i)

    parse_href = []
    for i in cleaned_table:
        if '<' in i:
            parse_href.append(i[9:-2])
        else:
            parse_href.append(i)

    formatted_output = []
    for i in range(0, len(parse_href), 4):
        formatted_output.append([parse_href[i], f"https://www.medsafe.govt.nz/hot/Recalls/{parse_href[i+1]}", parse_href[i+2], parse_href[i+3]])
        
    return formatted_output
