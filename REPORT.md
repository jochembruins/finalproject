# Eindproject - Jochem Bruins
## Report

### Korte beschrijving
De applicatie bestaat uit vier verschillende visualisaties die allemaal betrekking hebben op incidenten met verwarde personen in Nederland.
1. Een gecombineerde grafiek: toont de toename in media-aandacht voor het fenomeen en vergelijkt dat met het aantal E33-meldingen (binnengekomen bij de politie).
2. Een kaart: toont het aantal E33-meldingen per 1000 inwoners per gemeente. Met de slider ernaast kan een ander jaar (2013 t/m 2017) geselecteerd worden.
3. Een staafdiagram: toont het absolute aantal E33 meldingen voor een gemeente. Deze gemeente kan geselecteerd worden op de kaart.
4. Een puntenwolk: onderzoekt of er een verband is tussen het aantal E33-meldingen (x-as) en de uitgaven aan de GGZ (y-as) in gemeentes. 

#### Screenshot
![](doc/screenshot.jpg)

### Technische design
Om te beginnen is er een Javascriptbestand dat alle data van eigen server haalt. Vervolgens hebben alle afzonderlijke grafieken hun eigen Javascriptbestand. Voor alle grafieken is er een fuctie geschreven die de data filtert en omzet naar een werkbaar formaat. Vervolgens is er een grote fuctie die de visualisatie daadwerkelijk tekent. Daarbij kennen alle visualisaties behalve de puntenwolk een updatefunctie. Deze kan de grafiek aanpassen met andere data. Tot slot bevatten de bestanden kortere functies die de grotere functies assisteren. 

#### Gecombineerde grafiek
Voordat de grafiek gemaakt kon worden, moest eerst de data geprepareerd worden. Ik begon met een CSV, omgezet naar JSON, met daarin alle artikelen en hun datum van publicatie. Vervolgens heb ik de datum omgezet naar de eerste dag van het kwartaal. Op deze manier kon ik vervolgens tellen hoeveel artikelen er elk kwartaal zijn geschreven sinds het begin van 2011. Dit kostte behoorlijk wat tijd en moeite. Mogelijk had ik dit bij nader inzien beter in Python kunnen doen. Nadat het uiteindelijk gelukt was, kon de lijngrafiek simpel gemaakt worden. In de laatste week heb ik ook bepaalde belangrijke momenten toegevoegd aan de lijn. Met D3-annotations was dit heel makkelijk. 

De staafdiagram binnen de gecombineerde grafiek was qua data veel makkelijker. De CSV met daarin de jaren en de aantallen E33-meldingen kon simpel worden omgezet naar een JSON. Ook het maken van de grafiek was niet heel lastig. Enkel het plaatsen op dezelfde as als de lijngrafiek kostte wat tijd. Met D3-tip is een tooltip toegevoegd.
Ook het HTML-element dat de staven laat verschijnen, was niet heel moeilijk om te programmeren. 

#### Kaart
De kaart heeft veruit de meeste voeten in de aarde gehad. Aangezien datamaps geen gemeentegrenzen kent, moest ik op zoek naar een alternatief. Helaas kreeg ik TopoJSON's niet aan het werk, waarna me aangeraden werd een SVG-map te gebruiken. Dit is uiteindelijk wel gelukt. De data van de politie heb ik eerst moeten omzetten naar meldingen per 1000 inwoners. Daarna heb ik de gemeentelijke code's achter de gemeentes geplaatst omdat de id's van de verschillende paths in de kaarten hiermee overeen komen. Zowel de inwoneraantallen als de gemeentelijke code's zijn afkomstig van het CBS. Toen de data eenmaal compleet was in de CSV, heb ik deze omgezet naar een JSON. Daarna was het lastig om de juiste elementen in de SVG-map te selecteren, maar dit is uiteindelijk wel gelukt. Vervolgens is de data als attributen toegevoegd aan de verschillende paths.

De slider naast de kaart heeft ook heel wat moeite gekost, aangezien ik deze graag verticaal wilde plaatsen. Dit past mooier naast de kaart. Daarnaast wilden de DIV's elkaar nog weleens overlappen, waardoor de slider niet veranderd kon worden. Na dit met marges goed te hebben gezet, werkt het uitstekend. Wanneer de slider wordt versleept, treed een updatefunctie in werking. Deze verandert de kleur door een ander attribuut te selecteren en de kleur te berekenen met de kleurschaal (D3-functie).

#### Staafdiagram
De staafdiagram maakt gebruik van de data van de politie over E33-meldingen. 
Wanneer de gebruiker op een gemeente in de kaart klikt, filtert een functie de data voor de desbetreffende gemeente en update de staafdiagram. Zowel de functie die de grafiek maakt als de updatefunctie, was simpel te maken. Dit deel van de visualisatie kostte de minste moeite. Ook de interactie met de kaart is goed te maken. Met D3-tip is een tooltip toegevoegd.

#### Puntenwolk
De puntenwolk was een lastig deel van de visualisatie. Om te beginnen kostte het wat tijd om alle data van de verzekeraar voor alle leeftijdsgroepen en geslachten per gemeente samen te voegen. Nadat dit gelukt was, kon ik er wel simpel een JSON van maken. Omdat alle punten te veel bij elkaar lagen, heb ik zelf wat verschillende schalen op beide assen uitgeprobeerd. De huidige gaf uiteindelijk het meest overzichtelijke resultaat. De meeste moeite ging zitten in het maken van de tooltip en de interactie met de kaart. Wanneer de gebruiker over de kaart gaat, licht het bijbehorende punt op in puntenwolk. Andersoms werkt dit ook. De tooltip in de puntenwolk werkt ook wanneer men met de muis over de kaart gaat. Op deze manier is het makkelijker om een bepaalde gemeente te vinden. Voor de puntenwolk heb ik geen gebruik gemaakt van D3-tip omdat een eigen tooltip meer mogelijkheden gaf qua uiterlijk. 

### Uitdagingen en aanpassingen
De meeste uitdagingen heb ik hierboven al genoemd. Eigenlijk wijkt mijn eindresultaat nauwelijks af van het plan dat ik in het begin had. Het grootste verschil (en tevens uitdaging) is de kaart. Aan het begin wilde ik dit met een TopoJSON doen. Helaas kon ik geen goede TopoJSON vinden voor de gemeentelijke indeling van Nederland. Deze heb ik vervolgens zelf proberen te maken met behulp van een shapefile. Ook dit kreek ik niet werkend. Uiteindelijk heb ik toen gebruik gemaakt van een SVG-map. Dit werkte wel, maar was soms wat onhandig omdat het minder makkelijk aan te passen is. Elementen selecteren is wat omslachtig en hoogte en breedte staan behoorlijk vast. 

Een andere uitdaging was het maken van een tooltip voor de puntenwolk die ook werkte bij een 'hover' over de kaart. Ik kreeg het niet voor elkaar om dit in een enkele functie werkbaar te krijgen. Uiteindelijk heb ik twee verschillende functies gemaakt die dezelfde tooltip zichtbaar maken in de puntenwolk. Deze herhaling in de code is een minpunt hiervan. 

Tot slot heb ik nog een aanpassing gedaan wat betreft een HTML-element. Ik heb ervoor gekozen om geen knop te maken die de scatterplot zichtbaar maakt. Omdat de interactie met de kaart meteen duidelijk moet zijn wat mij betreft, heb ik deze keuze genomen. Om de grafiek te voorzien van benodigde informatie heb ik een i-button toegevoegd (rechts naast de titel) die informatie toont wanneer de muis erop staat. 

