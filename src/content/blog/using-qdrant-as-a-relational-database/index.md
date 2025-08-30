---
title: "Using Qdrant as a Relational Database"
description: "Ok, well, almost"
date: "Jun 11 2025"
---

Qdrant is a "vector database" but it can also function quite happily **as a relational database** for many traditional use cases, thanks to its powerful payload system.

## Understanding Qdrant Payloads

Every vector in Qdrant can have an associated payload – essentially a JSON document that can contain any structured data. This payload system is where the "relational database" magic happens:

```json
{
  "id": 1,
  "vector": [0.1, 0.2, 0.3, ...],
  "payload": {
    "user_id": 12345,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "department": "Engineering",
    "salary": 75000,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

You can query, filter, and sort based entirely on payload data, without ever touching the vector component.

## Traditional Database Operations

### Creating Records (INSERT)

```python
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

client = QdrantClient("localhost", port=6333)

# Insert a new user record
client.upsert(
    collection_name="users",
    points=[
        PointStruct(
            id=1,
            vector=[0.0] * 128,  # Dummy vector if you don't need similarity search
            payload={
                "user_id": 12345,
                "name": "John Doe",
                "email": "john@example.com",
                "age": 30,
                "department": "Engineering"
            }
        )
    ]
)
```

### Reading Records (SELECT)

```python
# SELECT * FROM users WHERE department = 'Engineering'
result = client.scroll(
    collection_name="users",
    scroll_filter={
        "must": [
            {"key": "department", "match": {"value": "Engineering"}}
        ]
    },
    with_payload=True,
    with_vectors=False  # We don't need vectors for relational queries
)

# SELECT * FROM users WHERE age > 25 AND department = 'Engineering'
result = client.scroll(
    collection_name="users",
    scroll_filter={
        "must": [
            {"key": "age", "range": {"gt": 25}},
            {"key": "department", "match": {"value": "Engineering"}}
        ]
    },
    with_payload=True,
    with_vectors=False
)
```

### Updating Records (UPDATE)

```python
# UPDATE users SET salary = 80000 WHERE user_id = 12345
client.set_payload(
    collection_name="users",
    payload={"salary": 80000},
    points=[1]  # Point ID
)
```

### Deleting Records (DELETE)

```python
# DELETE FROM users WHERE user_id = 12345
client.delete(
    collection_name="users",
    points_selector=[1]  # Point ID
)
```

## Advanced Querying Capabilities

Qdrant's filtering system is surprisingly powerful for relational-style queries:

### Range Queries

```python
# Users aged between 25 and 35
scroll_filter={
    "must": [
        {"key": "age", "range": {"gte": 25, "lte": 35}}
    ]
}
```

### Text Matching

```python
# Users with names containing "John"
scroll_filter={
    "must": [
        {"key": "name", "match": {"text": "John"}}
    ]
}
```

### Complex Boolean Logic

```python
# (Engineering OR Marketing) AND age > 30
scroll_filter={
    "must": [
        {"key": "age", "range": {"gt": 30}},
        {
            "should": [
                {"key": "department", "match": {"value": "Engineering"}},
                {"key": "department", "match": {"value": "Marketing"}}
            ]
        }
    ]
}
```

## When This Approach Makes Sense

Using Qdrant as a relational database is particularly powerful when you:

1. **Need both structured and semantic search**: Store user profiles with traditional fields AND enable semantic search on descriptions or content
2. **Want unified infrastructure**: One database for both your AI features and traditional data storage
3. **Have moderate scale requirements**: Qdrant handles millions of records efficiently
4. **Value simplicity**: Fewer moving parts in your infrastructure

## Limitations to Consider

While Qdrant can function as a relational database, it's important to understand its limitations:

- **No ACID transactions**: Qdrant doesn't provide traditional ACID guarantees
- **Limited aggregation**: No built-in GROUP BY, SUM, COUNT operations
- **No foreign keys**: You'll need to handle relationships in application code
- **Schema flexibility**: While flexible, this can lead to inconsistent data if not managed properly

## Real-World Example: User Management System

Here's how you might implement a simple user management system:

```python
class UserManager:
    def __init__(self, client, collection_name="users"):
        self.client = client
        self.collection_name = collection_name

    def create_user(self, user_data):
        """Create a new user record"""
        point = PointStruct(
            id=user_data["user_id"],
            vector=[0.0] * 128,  # Dummy vector
            payload=user_data
        )
        self.client.upsert(self.collection_name, [point])

    def get_users_by_department(self, department):
        """Get all users in a specific department"""
        result = self.client.scroll(
            collection_name=self.collection_name,
            scroll_filter={
                "must": [{"key": "department", "match": {"value": department}}]
            },
            with_payload=True,
            with_vectors=False
        )
        return [point.payload for point in result[0]]

    def update_user_salary(self, user_id, new_salary):
        """Update a user's salary"""
        self.client.set_payload(
            collection_name=self.collection_name,
            payload={"salary": new_salary},
            points=[user_id]
        )

    def search_users_by_name(self, name_query):
        """Search users by name (fuzzy matching)"""
        result = self.client.scroll(
            collection_name=self.collection_name,
            scroll_filter={
                "must": [{"key": "name", "match": {"text": name_query}}]
            },
            with_payload=True,
            with_vectors=False
        )
        return [point.payload for point in result[0]]
```

## The Best of Both Worlds

The real power emerges when you combine traditional relational queries with vector search capabilities. Imagine a user system where you can:

1. Query users by traditional criteria (department, age, location)
2. Find users with similar interests using semantic search
3. Recommend connections based on profile similarity
4. All in a single query!

```python
# Find Engineering users similar to a specific user profile
similar_users = client.search(
    collection_name="users",
    query_vector=target_user_embedding,
    query_filter={
        "must": [
            {"key": "department", "match": {"value": "Engineering"}},
            {"key": "active", "match": {"value": True}}
        ]
    },
    limit=10
)
```

## Conclusion

While Qdrant isn't a traditional relational database, its payload system is sufficient to handle many relational database use cases. For applications that need both structured data management AND semantic search capabilities, treating Qdrant as a relational database can significantly simplify infrastructure.
