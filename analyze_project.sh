#!/bin/bash

# Output file
OUTPUT_FILE="project_analysis.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

# Add header with date
echo "MERN Project Analysis" >> "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "==================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Section 1: Directory Structure
echo "Section 1: Directory Structure" >> "$OUTPUT_FILE"
echo "-----------------------------" >> "$OUTPUT_FILE"
# Exclude both node_modules and .git
tree -I "node_modules|.git" --noreport . >> "$OUTPUT_FILE" 2>/dev/null || echo "Tree command failed (install with 'sudo apt install tree' or equivalent)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Section 2: File Details
echo "Section 2: File Details" >> "$OUTPUT_FILE"
echo "----------------------" >> "$OUTPUT_FILE"
# Exclude both node_modules and .git in find
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | sort | while read -r file; do
    echo "File: $file" >> "$OUTPUT_FILE"
    echo "Size: $(stat -c %s "$file") bytes" >> "$OUTPUT_FILE"
    echo "Permissions: $(stat -c %A "$file")" >> "$OUTPUT_FILE"
    echo "Last Modified: $(stat -c %y "$file")" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

# Section 3: File Contents
echo "Section 3: File Contents" >> "$OUTPUT_FILE"
echo "-----------------------" >> "$OUTPUT_FILE"
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" | sort | while read -r file; do
    # Skip binary files and common non-code files
    if [[ ! $file =~ \.(png|jpg|jpeg|gif|svg|ico|pdf|bin|zip|tar|gz)$ ]]; then
        echo "File: $file" >> "$OUTPUT_FILE"
        echo "----------------" >> "$OUTPUT_FILE"
        # Add file content with line numbers, handle errors silently
        cat -n "$file" >> "$OUTPUT_FILE" 2>/dev/null || echo "Unable to read file contents" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "=================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    else
        echo "File: $file" >> "$OUTPUT_FILE"
        echo "----------------" >> "$OUTPUT_FILE"
        echo "(Binary file - contents not displayed)" >> "$OUTPUT_FILE"
        echo "=================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
done

# Section 4: Project Summary
echo "Section 4: Project Summary" >> "$OUTPUT_FILE"
echo "-------------------------" >> "$OUTPUT_FILE"
echo "Total Directories: $(find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l)" >> "$OUTPUT_FILE"
echo "Total Files: $(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l)" >> "$OUTPUT_FILE"
echo "Total Size: $(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -exec stat -c %s {} \; | awk '{sum += $1} END {print sum}') bytes" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Project analysis complete. Results saved in $OUTPUT_FILE"