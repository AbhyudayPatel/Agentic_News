import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function getNewsData(since?: Date) {
  try {
    if (!client.connect()) {
      await client.connect();
    }
    const database = client.db('news_database');
    const collection = database.collection('news_articles');
    
    const query = since ? { date: { $gt: since } } : {};
    
    const news = await collection.find(query)
      .sort({ date: -1 })
      .toArray();

    // Basic validation of required fields
    return news.map(item => ({
      ...item,
      _id: item._id.toString(),
      date: item.date.toISOString(),
      image_url: item.image_url || null,
      heading: item.heading || 'Untitled',
      article_summary: Array.isArray(item.article_summary) ? item.article_summary : []
    }));

  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
} 