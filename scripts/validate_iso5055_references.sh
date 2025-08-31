#!/bin/bash

# ISO/IEC 5055 Reference Validation Script
# This script validates the reference URLs in the ISO/IEC 5055 standard document
# Run this script when network access is available to check URL validity

echo "# ISO/IEC 5055 Reference Validation Results"
echo ""
echo "Validating reference URLs from _standards/iso-5055.md..."
echo ""

# URLs from the ISO/IEC 5055 references section
urls=(
    "https://webstore.ansi.org/standards/iso/isoiec50552021"
    "https://shop.bsigroup.com/products/information-technology-software-measurement-software-quality-measurement-automated-source-code-quality-measures/standard"
    "https://www.omg.org/spec/ASCQM/1.1/About-ASCQM"
    "https://www.omg.org/spec/ASCQM/1.1/PDF"
    "https://www.omg.org/spec/ASCQM/"
)

echo "| Reference URL | Status Code | Result | Final URL |"
echo "|:--- |:--- |:--- |:--- |"

# Check each URL
for url in "${urls[@]}"; do
    echo -n "Checking: $url... " >&2
    
    result=$(curl -s -o /dev/null -w "%{http_code}|%{url_effective}" -L \
        --max-time 15 \
        --connect-timeout 10 \
        -H "User-Agent: Mozilla/5.0 (compatible; arc42-link-checker/1.0)" \
        "$url" 2>/dev/null)
    
    IFS='|' read -r status final_url <<< "$result"
    
    case $status in
        200)
            echo "✅ OK" >&2
            echo "| $url | $status | ✅ OK | $final_url |"
            ;;
        30[12378])
            echo "↗️ Redirect ($status)" >&2
            echo "| $url | $status | ↗️ Redirect | $final_url |"
            ;;
        403)
            echo "🔒 Forbidden" >&2
            echo "| $url | $status | 🔒 Forbidden | Access denied |"
            ;;
        404)
            echo "❌ Not Found" >&2
            echo "| $url | $status | ❌ Not Found | URL not found |"
            ;;
        000|'')
            echo "❌ Failed" >&2
            echo "| $url | N/A | ❌ Failed | Connection failed or timeout |"
            ;;
        *)
            echo "⚠️ Other ($status)" >&2
            echo "| $url | $status | ⚠️ Other | HTTP status: $status |"
            ;;
    esac
done

echo ""
echo "## Summary"
echo ""
echo "Validation completed on: $(date)"
echo ""
echo "**Usage**: Run this script periodically to ensure all reference URLs remain valid."
echo "**Note**: Some sites may block automated requests or require different user-agent headers."