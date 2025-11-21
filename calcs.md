few formulas :

 RATING: standardized rating
If Issuer rating = &quot;NR&quot; Then
standardized rating = « NR »
ElseIf Issuer rating = &quot;A&quot; Or Issuer rating = &quot;A+&quot; Or Issuer rating = &quot;A-&quot; Issuer rating =
&quot;A1&quot; Or Issuer rating = &quot;A2&quot; Issuer rating = &quot;A3&quot; Then
standardized rating = « A »
ElseIf Issuer rating = &quot;AA&quot; Or Issuer rating = &quot;AA+&quot; Or Issuer rating = &quot;AA-&quot; Or Issuer
rating = &quot;Aa1&quot; Or Issuer rating = &quot;Aa2&quot; Or Issuer rating = &quot;Aa3&quot; Then
standardized rating = « AA »
ElseIf Issuer rating = &quot;AAA&quot; Or Issuer rating = &quot;AAA+&quot; Or Issuer rating = &quot;AAA-&quot; Or
Issuer rating = &quot;Aaa1&quot; Or Issuer rating = &quot;Aaa2&quot; Issuer rating = &quot;Aaa3&quot; Then
standardized rating = « AAA »
ElseIf Issuer rating = &quot;B&quot; Or Issuer rating = &quot;B+&quot; Or Issuer rating = &quot;B-&quot; Or Issuer
rating = &quot;B1&quot; Or Issuer rating = &quot;B2&quot; Or Issuer rating = &quot;B3&quot; Then
standardized rating = « B »
ElseIf Issuer rating = &quot;BB&quot; Or Issuer rating = &quot;BB+&quot; Or Issuer rating = &quot;BB-&quot; Or Issuer
rating = &quot;Ba1&quot; Or Issuer rating = &quot;Ba2&quot; Or Issuer rating = &quot;Ba3&quot; Then
standardized rating = « BB »
ElseIf Issuer rating = &quot;BBB&quot; Or Issuer rating = &quot;BBB+&quot; Or Issuer rating = &quot;BBB-&quot; Or
Issuer rating = &quot;Baa1&quot; Or Issuer rating = &quot;Baa2&quot; Or Issuer rating = &quot;Baa3&quot; Then
standardized rating = « BBB »
ElseIf Issuer rating = &quot;CCC&quot; Issuer rating = &quot;CCC+&quot; Or Issuer rating = &quot;CCC-&quot; Or Issuer
rating = &quot;Caa1&quot; Or Issuer rating = &quot;Caa2&quot; Or Issuer rating = &quot;Caa3&quot; Then
standardized rating = « CCC »
ElseIf Issuer rating = &quot;CC&quot; Or Issuer rating = &quot;CC+&quot; Or Issuer rating = &quot;CC-&quot; Or Issuer
rating = &quot;Ca1&quot; Or Issuer rating = &quot;Ca2&quot; Or Issuer rating = &quot;Ca3&quot; Then

standardized rating = « CC »
ElseIf Issuer rating = &quot;C&quot; Or Issuer rating = &quot;C+&quot; Or Issuer rating = &quot;C-&quot; Or Issuer
rating = &quot;C1&quot; Or Issuer rating = &quot;C2&quot; Or Issuer rating = &quot;C3&quot; Then
standardized rating = « C »
Else
MsgBox (&quot;rating non trouvé pour ligne&quot; &amp; &quot;&quot; &amp; i)
End If

 Fichier : CBHIST, sheet (« Daily Fields &amp; Greeks »), colonnes (AZ : BG »)
 Vol spread = ImpVol (%) – VOLATILITY ( input)
 relative situation : (Overpriced/Underpriced 
IF(Vol spread &lt;&gt;&quot;&quot;;if (Vol spread &lt;0;&quot;underpriced&quot;;if(and( Vol spread &gt;0; Vol
spread &lt;4);&quot;fair value&quot;;if (and(Vol spread &gt;4; Vol spread &lt;8);&quot;overpriced&quot;;SI(Vol
spread &gt;8;&quot;expensive&quot;))));&quot;&quot;)

 Downside risk =

o IF Vol spread &gt; 0 and Vol spread &lt;&gt; » » then
Downside risk = Vol spread * vega %
Else
« « 
End if

 average volatility spreads and Standard deviation :

&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;&#39;Calcul de la moyenne des écarts de (implied vol – Vol historique) + Standard deviation
pour chaque OCs uniquement pendant les périodes pendant lesquelles l&#39;OC affiche un profil mixte

VItotale = 0
NB = 0
Somme = 0
Standard deviation = 0
For i = 1 To nombre d’OC
If VEGA(i) &gt; 0 ,25 And ImpVol (i) &lt;&gt; &quot;&quot; Then

VItotale = VItotale + (ImpVol (i) - VOLATILITY (i))
NB = NB + 1
End If
Next i
If NB &lt;&gt; 0 Then
average volatility spreads = VItotale / NB

 Standard deviation :
For k = i To nombreOC
If VEGA(i) &gt; 0 ,25 And ImpVol (i) &lt;&gt; &quot;&quot; Then
Écart = (ImpVol (i) -Vol (i)))
Somme = somme + (écart - average volatility spreads) ^ 2
End If
Next i
Standard deviation = (somme / NB) ^ (1 / 2)

Else

average volatility spreads = « «
Standard deviation = « « 
End if

Ensuite calculer :

 Spread to average:
If Vol spread &lt;&gt; » » and average volatility spreads &lt;&gt; » » then
Spread to average = Vol spread – average volatility spreads
Else
Spread to average = « « 
End if

 Zscore :
If Vol spread &lt;&gt; » » then
Zscore = Spread to average / Standard deviation
Else
Zscore = « « 
End if

 observation :
Si abs(Spread to average)&gt; 2, Et :

if le overcote /undercote = (fair value, ou underpriced), Et : Spread to average

&lt;0 , zscore en valeur absolue &gt; 1 then :  » High probability of a rebound « 

if overcote /undercote = (overpriced Ou exprensive), Et : Spread to average &gt;

0 , zscore en valeur absolue &gt; 1 : THEN High probability of downside

 Classification par qualité de crédit ( IG, HY, NR )
If left(standardized rating,1) = &quot;A&quot; Or left(standardized rating ,3) = &quot;BBB&quot; Or Then
Credit risk= IG
ElseIf Left(standardized rating, 1) = &quot;N&quot; Then
Credit risk = NR
Else
Credit risk = HY
End If

 Classification des entreprises selon leur market cap :

- Small Cap : Si market cap de l’equity &lt; 2.5 milliard euro
- Mid Cap : SI market cap &gt; 2.5 Milliard euro et inférieur à 6.9 milliard euros
- Large cap pour toute market cap &gt; 6.9 milliard euros.

 Classification par maturité :
x = MaturityOC(i)
x1 = Date( aujourd’hui)
mat = (CLng(x) - CLng(x1)) / 365
If mat &lt;= 1 Then
residual maturity = « &lt;1 Y »
ElseIf mat &gt; 1 And mat &lt;= 2 Then
residual maturity = ]1,2]
ElseIf mat &gt; 2 And mat &lt;= 5 Then
residual maturity = ]2,5]

ElseIf mat &gt; 5 Then
residual maturity = « &gt;1 Y »
End If

 Rebaser une série de performances à une base 100
Pour une série de performances Pt, où t est l&#39;index du temps, la formule pour rebaser à 100 est
la suivante :
Pt(rebased) = X100
Étapes :
1. Identifiez le point de départ (P0​), qui sera la valeur initiale à rebaser : Pour nous ça sera le
premier jour du démarrage
2. Divisez chaque valeur de la série par cette valeur initiale P0
3. Multipliez le résultat par 100 pour obtenir une base commune.

Exemple :
Imaginons une série de performances :
 Jour 1 : 120
 Jour 2 : 125
 Jour 3 : 130
Pour rebaser à 100 en prenant P0=120 (Jour 1) :
 P1(rebased)=(120/120)×100=100
 P2(rebased)=(125/120)×100=104,17
 P3(rebased)=(130/120)×100=108.33

 Performance Year-to-Date (YTD )
Performance YTD(%)= ( ​​− 1)×100
 Performance Month-to-Date (MTD )
Performance YTD(%)= ( ​​− 1)×100

 Performance 3Month-to-Date (YTD )
Performance YTD(%)= ( ​​− 1)×100