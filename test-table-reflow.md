# Test Table Reflow

## Test 1: Cursor inside table (no selection)
Place cursor anywhere in this table and run "Reflow Table" command.
The entire table should be reformatted.

| Name | Age | City |
|---|---|---|
| Alice | 30 | New York |
| Bob | 25 | Los Angeles |

Some text after the table.

## Test 2: Partial selection
Select just part of a line in this table and run "Reflow Table" command.
The entire selected lines should be reformatted.

| Product | Price | Stock |
|---|---|---|
| Widget | $10 | 100 |
| Gadget | $25 | 50 |

## Test 3: Full selection
Select all lines of this table and run "Reflow Table" command.

| Item | Quantity | Total |
|---|---|---|
| Apples | 5 | $2.50 |
| Oranges | 3 | $1.50 |

End of document.
