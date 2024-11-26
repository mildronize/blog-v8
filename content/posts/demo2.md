+++
title = "Demo 2"
date = "2024-08-01"


[taxonomies]
categories = ["rust"]
tags = ["one", "two", "three"]

[extra]
mermaid = true 
+++

efwjefwep 

{% note(header="Note") %}
note text
{% end %}

# Diagrams

{% mermaid() %}
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
{% end %}