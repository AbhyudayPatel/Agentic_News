import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  article_url: {
    type: String,
    required: true
  },
  article_summary: {
    type: [String],
    required: true
  }
});

export default mongoose.model('news_articles', NewsSchema); 