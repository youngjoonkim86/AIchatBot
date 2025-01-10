def get_text_and_table_prompt():
    """
    기본 텍스트 및 테이블 추출 프롬프트
    """
    return """Extract the text and table data from the image. 
    Please remove any guide phrases, unnecessary instructions, or irrelevant content. 
    Only provide the relevant text and table data in a clean JSON format without any additional commentary. 
    Do not include any introductory or guide phrases, and return only the extracted content.
    If the wording "Connector No.↔ Connector No." appears on a single line, ensure it is extracted and formatted as defined in the Structured JSON of Example 4. 
    For any other tables, extract and format them as demonstrated in the remaining Examples.

    
    ### Example 1

    #### Text:
    SECTION INDEX
    GENERAL ........................................ 0
    BATTERY ........................................ 1
    ELECTRICAL SYSTEM TROUBLESHOOTING .............. 5

    #### Structured JSON:
    {
      "type": "text",
      "subtype": "general text",
      "category": "table of contents",
      "content": [
        {"section": "GENERAL", "page": "0"},
        {"section": "BATTERY", "page": "1"},
        {"section": "ELECTRICAL SYSTEM TROUBLESHOOTING", "page": "5"}
      ]
    }

    ---

    ### Example 2

    #### Text:
    This manual contains diagnostic procedures for the Toyota Electric Forklift 7FB series.

    #### Structured JSON:
    {
      "type": "text",
      "subtype": "general text",
      "category": "description",
      "content": "This manual contains diagnostic procedures for the Toyota Electric Forklift 7FB series."
    }

    ---

    ### Example 3

    #### Table (열병합):
    ----------------------------------------------------------------------------
    | Diagnostic Steps      | Voltage Measurements          | Remarks         |
    |-----------------------|------------------------------|-----------------|
    | Step 1: Measure voltage| Diagram:                    |                 |
    |                       | ┌───────────────────────┐    | "Check the       |
    |                       | | Circuit Diagram Here  |    | connection at    |
    |                       | └───────────────────────┘    | CN101-26."      |
    ----------------------------------------------------------------------------

    #### Structured JSON:
    {
      "type": "table",
      "subtype": "complex table",
      "category": "merged columns",
      "content": [
        {
          "Diagnostic Steps": "Step 1: Measure voltage",
          "Voltage Measurements": {
            "diagram": "Circuit Diagram Here"
          },
          "Remarks": "Check the connection at CN101-26."
        }
      ]
    }

    ---

    ### Example 4

    #### Table (행병합):
    ----------------------------------------------------------------------------
    | Voltage Levels | CN101       | CN102       | Remarks                     |
    |----------------|-------------|-------------|-----------------------------|
    |                | 48V         | 80V         | Normal voltage range        |
    | High Voltage   |             |             | Voltage above standard      |
    | Low Voltage    |             |             | Voltage below standard      |
    ----------------------------------------------------------------------------

    #### Structured JSON:
    {
      "type": "table",
      "subtype": "complex table",
      "category": "merged rows",
      "content": [
        {
          "Voltage Levels": "High Voltage",
          "CN101": "48V",
          "CN102": "80V",
          "Remarks": "Voltage above standard"
        },
        {
          "Voltage Levels": "Low Voltage",
          "CN101": "48V",
          "CN102": "80V",
          "Remarks": "Voltage below standard"
        }
      ]
    }

    ---

    ### Example 5

    #### Table (표 안의 그림):
    ----------------------------------------------------------------------------
    | Diagnostic Steps      | Voltage Measurements          | Remarks         |
    |-----------------------|------------------------------|-----------------|
    | Step 1: Measure voltage| Diagram:                    |                 |
    |                       | ┌───────────────────────┐    | "Check the       |
    |                       | | Circuit Diagram Here  |    | connection at    |
    |                       | └───────────────────────┘    | CN101-26."      |
    ----------------------------------------------------------------------------

    #### Structured JSON:
    {
      "type": "table",
      "subtype": "complex table",
      "category": "table with image",
      "content": [
        {
          "Diagnostic Steps": "Step 1: Measure voltage",
          "Voltage Measurements": {
            "diagram": {
              "type": "image",
              "description": "Circuit Diagram",
              "annotations": [
                "Indicates CN101 connection"
              ]
            }
          },
          "Remarks": "Check the connection at CN101-26."
        }
      ]
    }

    ---

    ### Example 6

    #### Diagram:
    Step 1: Inspect battery.
        - Yes → Continue to Step 2.
        - No → Replace battery.
    Step 2: Check CPU board voltage.
        - Within range → Normal operation.
        - Out of range → Replace CPU board.

    #### Structured JSON:
    {
      "type": "diagram",
      "subtype": "complex schematic",
      "category": "arrow explanation",
      "content": {
        "steps": [
          {
            "description": "Inspect battery.",
            "options": [
              {"condition": "Yes", "next": "Continue to Step 2."},
              {"condition": "No", "next": "Replace battery."}
            ]
          },
          {
            "description": "Check CPU board voltage.",
            "options": [
              {"condition": "Within range", "next": "Normal operation."},
              {"condition": "Out of range", "next": "Replace CPU board."}
            ]
          }
        ]
      }
    }
    }

    """
