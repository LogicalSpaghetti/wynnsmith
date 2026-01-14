For each node pair (a,b)
a -> b if a could sanely go before b
b -> a if b could sanely go before a

WEO = order Zeer creates
AEO = order the player equips item, all suborders must be valid WEOs



Solver:
remove all items that give no SP (nonContributing) from the order (add last)
set the initial assignedSP to max(weaponReq,...craftedReqs,...nonContributingReqs)-totalGiven
try equipping items following WEO order until an item whos reqs aren't yet met is found (add first)
    must be before we remove anything that gives sp
remove all items that have no req and give no negative sp (add first)



Note: requires all optimal SP assignments for a WEO to be generated.
When a WEO is generated that includes one or more items that give +SP and -SP, generate the 

do the n!, adding one item at a time and solving for the WEO