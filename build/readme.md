Json description:

```
   "id": the ID of this guy,
    "name":Name to be displayed,
        "action": {
            "distanceMin":Minimal distance from origin where the attack can reach,
            "distanceMax":Maximum distance from origin where the attack can reach,
            "rangeOfVision": enum: STRAIGHT, CONE, WIDE, ALL
            "diagonalVision": true/false
            "pattern": [  //Pattern always assumes North-aimed attack.
                {
                    "source":["SOURCE"],
                    "dice":"1d6",
                    "effect": {
                        "type": enum: DAMAGE, HEAL, BUFF, SPECIAL
                        "desc": description of the effect, i.e. buffs targets with a +1 on next 2 attacks
                    } 
                },
                {
                    "source":["SW"],
                    "dice":"1d3".
                    "effect": {
                        "type": enum: DAMAGE, HEAL, BUFF, SPECIAL
                        "desc": description of the effect, i.e. buffs targets with a +1 on next 2 attacks
                    } 
                },
                {
                    "source":["SW", "SW"],
                    "dice":"1d2",
                    "effect": {
                        "type": enum: DAMAGE, HEAL, BUFF, SPECIAL
                        "desc": description of the effect, i.e. attacker moves to this hex if unoccupied.
                    } 
                }
            ]
            
        }  
```