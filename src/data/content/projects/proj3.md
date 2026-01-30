Built to solve a real bottleneck in our data pipeline at work. We needed to process thousands of API requests, image transformations, and database operations concurrently without blocking the main application.

Architecture:
• Celery workers distributed across multiple containers
• Redis as the message broker and result backend
• Flower for monitoring and administration
• Custom priority queue implementation
• Automatic retry logic with exponential backoff

Performance metrics:
• Processing 10,000+ tasks per minute
• 99.9% success rate with retry logic
• Average latency under 100ms
• Horizontal scaling across 20+ workers

This system reduced our batch processing time from hours to minutes and made real-time features possible that weren't feasible before.