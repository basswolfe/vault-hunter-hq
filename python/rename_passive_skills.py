#!/usr/bin/env python3
import os
import re
import glob

def extract_info_from_filename(filename):
    """Extract row number, skill type, and skill name from the original filename"""
    # Remove the path and get just the filename
    basename = os.path.basename(filename)

    # Look for patterns like "Row-1-", "Row-2-", etc.
    row_match = re.search(r'Row-(\d+)-', basename)
    if not row_match:
        return None, None, None

    row_num = row_match.group(1)

    # Look for skill type (Passive, Active, etc.)
    type_match = re.search(r'-(Passive|Active|PASSIVE|ACTIVE)-', basename)
    if not type_match:
        return None, None, None

    skill_type = type_match.group(1).title()  # Convert to "Passive" format

    # Extract skill name (everything after the skill type until the file extension)
    skill_name_match = re.search(r'-(?:Passive|Active|PASSIVE|ACTIVE)-(.+?)\.png$', basename)
    if not skill_name_match:
        return None, None, None

    skill_name = skill_name_match.group(1)

    # Clean up the skill name
    skill_name = skill_name.replace('-', '_')
    skill_name = skill_name.replace('__', '_')
    skill_name = skill_name.strip('_')

    return row_num, skill_type, skill_name

def rename_passive_files():
    """Rename all passive skill files to the new format"""
    base_path = "skill-icons"

    # Find all PNG files that contain "Passive" or "PASSIVE" but not "Augment" or "Capstone"
    all_files = []
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith('.png') and ('Passive' in file or 'PASSIVE' in file):
                if 'Augment' not in file and 'Capstone' not in file:
                    all_files.append(os.path.join(root, file))

    renamed_count = 0
    skipped_count = 0

    for filepath in all_files:
        row_num, skill_type, skill_name = extract_info_from_filename(filepath)

        if row_num and skill_type and skill_name:
            # Create new filename
            new_filename = f"Row_{row_num}-{skill_type}-{skill_name}.png"
            new_filepath = os.path.join(os.path.dirname(filepath), new_filename)

            # Only rename if the new name is different
            if filepath != new_filepath:
                try:
                    os.rename(filepath, new_filepath)
                    print(f"Renamed: {os.path.basename(filepath)} -> {new_filename}")
                    renamed_count += 1
                except Exception as e:
                    print(f"Error renaming {filepath}: {e}")
            else:
                skipped_count += 1
        else:
            print(f"Could not parse: {os.path.basename(filepath)}")
            skipped_count += 1

    print(f"\nSummary: {renamed_count} files renamed, {skipped_count} files skipped")

if __name__ == "__main__":
    rename_passive_files()