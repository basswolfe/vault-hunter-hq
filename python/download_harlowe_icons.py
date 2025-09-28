#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urlparse

def download_image(url, filepath):
    """Download an image from URL to filepath"""
    try:
        # Add https if the URL starts with //
        if url.startswith('//'):
            url = 'https:' + url

        response = requests.get(url, stream=True)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"Downloaded: {filepath}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def extract_skill_icons():
    """Extract all skill icon URLs from the Harlowe page"""
    url = "https://borderlands.2k.com/borderlands-4/game-info/vault-hunters/harlowe/"

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        skill_icons = []

        # Find all images that appear to be skill icons
        images = soup.find_all('img')

        for img in images:
            src = img.get('src', '')
            title = img.get('title', '')
            alt = img.get('alt', '')

            # Look for skill icon patterns in the URL
            if 'BL4_Harlowe_Tree' in src and ('Passive' in src or 'Active' in src or 'Augment' in src or 'Capstone' in src):
                # Clean up the URL
                if src.startswith('//'):
                    src = 'https:' + src

                # Extract skill tree from URL
                skill_tree = 'unknown'
                if 'Creative_Bursts' in src:
                    skill_tree = 'creative_bursts'
                elif 'Seize_the_Day' in src:
                    skill_tree = 'seize_the_day'
                elif 'Cosmic_Brilliance' in src:
                    skill_tree = 'cosmic_brilliance'

                # Use title as skill name if available, otherwise use alt
                skill_name = title if title else alt

                skill_icons.append({
                    'url': src,
                    'title': skill_name,
                    'alt': alt,
                    'skill_tree': skill_tree,
                    'filename': os.path.basename(urlparse(src).path)
                })

        return skill_icons

    except Exception as e:
        print(f"Error extracting skill icons: {e}")
        return []

def main():
    """Main function to download all skill icons"""
    print("Extracting Harlowe skill icon URLs...")
    skill_icons = extract_skill_icons()

    if not skill_icons:
        print("No skill icons found!")
        return

    print(f"Found {len(skill_icons)} skill icons")

    # Create base directory
    base_dir = "skill-icons/harlowe"
    os.makedirs(base_dir, exist_ok=True)

    # Download each icon to appropriate directory
    for icon in skill_icons:
        tree_dir = os.path.join(base_dir, icon['skill_tree'])
        os.makedirs(tree_dir, exist_ok=True)

        filepath = os.path.join(tree_dir, icon['filename'])

        print(f"Downloading {icon['title']} ({icon['skill_tree']})...")
        download_image(icon['url'], filepath)

    print("Download complete!")

    # Print summary
    print("\nSummary:")
    for tree in ['creative_bursts', 'seize_the_day', 'cosmic_brilliance']:
        tree_icons = [i for i in skill_icons if i['skill_tree'] == tree]
        print(f"{tree.replace('_', ' ').title()}: {len(tree_icons)} icons")

if __name__ == "__main__":
    main()