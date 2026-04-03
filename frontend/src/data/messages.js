export const sampleMessages = [
  {
    id: 1,
    type: 'ai',
    content: 'Hello! I\'m your Code Bridge AI assistant. I can help you with programming questions, explain concepts, and guide you through coding challenges. What would you like to learn today?',
    timestamp: new Date(),
  },
  {
    id: 2,
    type: 'user',
    content: 'How do I create a variable in Python?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 3,
    type: 'ai',
    content: 'Great question! In Python, creating a variable is simple. You just write the variable name, an equals sign (=), and the value you want to store.\n\nHere\'s an example:\n```python\nname = "John"\nage = 25\nis_student = True\n```\n\nPython automatically knows the type of data you\'re storing. No need to declare the type like in some other languages!',
    timestamp: new Date(Date.now() - 240000),
  },
];