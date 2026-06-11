const express = require('express');
const router = express.Router();
const OpenAI = require('openai').default;
const Listing = require('../models/listing');

// OpenRouter Client
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

router.post('/', async (req, res) => {
  try {
    console.log('Body:', req.body);

    const message = String(req.body.message || '').trim();

    if (!message.trim()) {
      return res.status(400).json({
        reply: 'Message is required',
      });
    }

    // MongoDB search
    // const listings = await Listing.find({
    //   $or: [
    //     { title: { $regex: message, $options: 'i' } },
    //     { location: { $regex: message, $options: 'i' } },
    //   ],
    // }).limit(5);

    const searchTerm = message
      .toLowerCase()
      .replace('hotel in', '')
      .replace('stay in', '')
      .replace('find hotel in', '')
      .trim();

    console.log('Search term:', searchTerm);

    const listings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } },
        { country: { $regex: searchTerm, $options: 'i' } },
      ],
    }).limit(5);

    console.log('Listings found:', listings);

    const listingText =
      listings.length > 0
        ? listings
            .map((l) => `${l.title} in ${l.location} for ₹${l.price}`)
            .join('\n')
        : 'No matching stays found.';

    // OpenRouter API
    const completion = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',

      max_tokens: 500,

      messages: [
        {
          role: 'system',
          content: `
  You are WanderBot for WanderLust.

Only recommend listings from the provided data.
Never invent hotels, prices, or locations.
If no listing exists, say "No matching stays found."

Speak naturally and helpfully.
`,
        },
        {
          role: 'user',
          content: `
Available listings:
${listingText}

User message:
${message}
`,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error('FULL ERROR:', err);

    res.status(500).json({
      reply: err.message,
    });
  }
});

module.exports = router;
