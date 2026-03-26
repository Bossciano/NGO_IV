#!/bin/bash
# Run this once to download all images
# Requires: curl
mkdir -p images
echo "Downloading images..."

curl -L --silent --output "images/team-workspace.jpg" "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=85" && echo "✓ team-workspace.jpg" || echo "✗ team-workspace.jpg FAILED"
curl -L --silent --output "images/woman-learning.jpg" "https://images.unsplash.com/photo-1531931524-a58fd9e6e4d9?w=900&q=85" && echo "✓ woman-learning.jpg" || echo "✗ woman-learning.jpg FAILED"
curl -L --silent --output "images/community-outdoor.jpg" "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=700&q=85" && echo "✓ community-outdoor.jpg" || echo "✗ community-outdoor.jpg FAILED"
curl -L --silent --output "images/nigeria-youth-group.jpg" "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=85" && echo "✓ nigeria-youth-group.jpg" || echo "✗ nigeria-youth-group.jpg FAILED"
curl -L --silent --output "images/vocational-skills.jpg" "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=85" && echo "✓ vocational-skills.jpg" || echo "✗ vocational-skills.jpg FAILED"
curl -L --silent --output "images/digital-skills.jpg" "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&q=85" && echo "✓ digital-skills.jpg" || echo "✗ digital-skills.jpg FAILED"
curl -L --silent --output "images/entrepreneurship-team.jpg" "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=85" && echo "✓ entrepreneurship-team.jpg" || echo "✗ entrepreneurship-team.jpg FAILED"
curl -L --silent --output "images/youth-raised-arms.jpg" "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&q=85" && echo "✓ youth-raised-arms.jpg" || echo "✗ youth-raised-arms.jpg FAILED"
curl -L --silent --output "images/community-gathering.jpg" "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85" && echo "✓ community-gathering.jpg" || echo "✗ community-gathering.jpg FAILED"
curl -L --silent --output "images/educator-teaching.jpg" "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=85" && echo "✓ educator-teaching.jpg" || echo "✗ educator-teaching.jpg FAILED"
curl -L --silent --output "images/team-hands-together.jpg" "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=85" && echo "✓ team-hands-together.jpg" || echo "✗ team-hands-together.jpg FAILED"

echo ""
echo "Done! Open index.html in your browser."