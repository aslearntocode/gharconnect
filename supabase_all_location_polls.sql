-- Create polls for all locations
-- Each location will have its own poll with location-specific results

INSERT INTO polls (id, question, options, location) VALUES 
  ('worli-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'worli'),
  
  ('andheri-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'andheri'),
  
  ('juhu-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'juhu'),
  
  ('bandra-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'bandra'),
  
  ('powai-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'powai'),
  
  ('malad-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'malad'),
  
  ('thane-community-poll-1', 'What is the main pain point in your area?', '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb, 'thane')
  
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  options = EXCLUDED.options,
  updated_at = NOW(); 