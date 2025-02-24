import requests
import time
from bs4 import BeautifulSoup
from pymongo import MongoClient, DESCENDING
from datetime import datetime
from transformers import pipeline
import concurrent.futures
import logging
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class NewsScraperService:
    def __init__(self):
        # MongoDB connection with updated connection string
        self.client = MongoClient("mongodb+srv://abhyuday2023ug4002:abhyuday@cluster0.q3o87.mongodb.net/news_database?retryWrites=true&w=majority&appName=Cluster0")
        self.db = self.client["news_database"]
        self.news_collection = self.db["news_articles"]
        
        # Create index on date field for better sorting performance
        self.news_collection.create_index([("date", DESCENDING)])
        
        # Initialize summarizer
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        
        # Base URL
        self.base_url = "https://timesofindia.indiatimes.com/city/ranchi"

    def extract_date_from_article(self, soup):
        """Extract and parse the article date."""
        try:
            date_div = soup.find("div", class_="xf8Pm byline")
            if date_div and date_div.find("span"):
                date_text = date_div.find("span").text.strip()
                # Parse date from format like "Feb 23, 2024, 14:30 IST"
                date_obj = datetime.strptime(date_text, "%b %d, %Y, %H:%M IST")
                return date_obj
        except Exception as e:
            logging.error(f"Error parsing date: {str(e)}")
        return datetime.now()  # Fallback to current time if parsing fails

    def get_latest_news(self):
        """Scrape latest news articles from Times of India."""
        try:
            session = requests.Session()
            response = session.get(self.base_url)
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Get existing links from MongoDB
            existing_links = list(doc["article_url"] for doc in self.news_collection.find({}, {"article_url": 1}))
            
            # Find new article links
            new_links = []
            for a_tag in soup.find_all("a", href=True):
                if "/city/ranchi" in a_tag["href"] and ".cms" in a_tag["href"]:
                    if a_tag["href"] not in existing_links:
                        new_links.append(a_tag["href"])
            
            logging.info(f"Found {len(new_links)} new articles")
            return new_links
        except Exception as e:
            logging.error(f"Error in get_latest_news: {str(e)}")
            return []

    def extract_article_details(self, url):
        """Extract article content, heading, image, and date from URL."""
        try:
            session = requests.Session()
            response = session.get(url)
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract date
            article_date = self.extract_date_from_article(soup)
            
            article_div = None
            for div in soup.find_all("div", class_=True):
                if any(re.match(r"^fewcent-\d+", cls) for cls in div.get("class", [])):
                    article_div = div
                    break  # Stop after finding the first match

            content = " ".join([elem.text.strip() for elem in article_div.find_all("div", recursive=True) if elem.text.strip()]) if article_div else ""

            # Remove the last sentence
            sentences = content.split(". ")
            if len(sentences) > 1:
                content = ". ".join(sentences[:-2]) + "."
                
            # Extract heading
            heading = soup.find("h1", class_="HNMDR")
            heading_text = heading.text.strip().encode("latin1").decode("utf-8") if heading else "Heading not found"
            
            # Extract image
            img_div = soup.find("div", class_="img_wrapper") or soup.find("div", class_="wJnIp")
            img_url = img_div.find("img")["src"] if img_div and img_div.find("img") else None
            
            return content, heading_text, img_url, article_date
        except Exception as e:
            logging.error(f"Error extracting article details from {url}: {str(e)}")
            return None, None, None, None

    def summarize_news(self, article_text):
        """
        Summarize article using BART-Large-CNN model.
        
        Args:
            article_text (str): The raw article text to be summarized
            
        Returns:
            list: List of sentences forming the summary, each ending with a period
        """
        
        try:
            # Return empty list if no text provided
            if not article_text:
                return []
            
            # Calculate summary length parameters based on input
            input_length = len(article_text.split())
            min_length = 100  # Minimum summary length
            max_length = min(350, int(min_length * 0.9))  # Cap max length at 350
            
            # Adjust max_length if it falls below min_length
            if max_length < min_length:
                max_length = min_length + 50
            
            # Generate summary using BART model with specified parameters    
            summary = self.summarizer(
                article_text,
                max_length=max_length,
                min_length=min_length,
                length_penalty=1.2,      # Controls summary length
                num_beams=6,             # Number of beams for beam search
                do_sample=False          # Deterministic generation
            )[0]["summary_text"]
            
            encoded_summary = summary.encode("latin1").decode("utf-8")
            
            return [
                s.strip() + "." 
                for s in encoded_summary.split(".") 
                if s.strip()
            ]
        
        except Exception as e:
            # Log any errors during summarization
            logging.error(f"Error in summarize_news: {str(e)}")
            return []

    def store_news(self):
        """Main function to process and store news articles."""
        list_heading=[0]
        try:
            new_links = self.get_latest_news()
            
            for url in new_links:
                content, heading, img_url, article_date = self.extract_article_details(url)
                if not content:
                    continue
                    
                summary = self.summarize_news(content)
                list_heading[0]=heading
                document = {
                    "date": article_date,  # Store as ISODate
                    "heading":heading,
                    "image_url": img_url,
                    "article_url": url,
                    "article_summary": summary, # Additional timestamp for tracking insertion time
                }
                
                self.news_collection.insert_one(document)
                logging.info(f"Stored article: {heading} from {article_date}")
                
                # Brief pause between processing articles
                time.sleep(1)
                
        except Exception as e:
            logging.error(f"Error in store_news: {str(e)}")

    def get_latest_articles(self, limit=10):
        """Retrieve latest articles from MongoDB."""
        try:
            latest_articles = self.news_collection.find().sort("date", DESCENDING).limit(limit)
            return list(latest_articles)
        except Exception as e:
            logging.error(f"Error retrieving latest articles: {str(e)}")
            return []

def main():
    """Main execution function."""
    scraper = NewsScraperService()
    
    while True:
        try:
            logging.info("Starting news scraping cycle")
            scraper.store_news()
            
            # Log latest articles after each cycle
            latest = scraper.get_latest_articles(5)
            logging.info(f"Latest 5 articles in database:")
            for article in latest:
                logging.info(f"{article['date']} - {article['heading']}")
            
            logging.info("Completed news scraping cycle. Waiting for next cycle...")
            time.sleep(100)  # Wait for 1 hour before next cycle
        except Exception as e:
            logging.error(f"Error in main loop: {str(e)}")
            time.sleep(300)  # Wait 5 minutes on error before retrying

if __name__ == "__main__":
    main()