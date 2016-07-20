<?php
  // Fetch quotes from BrainyQuotes.com

  foreach (array("motivational", "inspirational", "life", "love", "positive", "success") as $cat) {

    $baseURL  = "http://www.brainyquote.com/quotes/topics/topic_" . $cat . ".html";

    // First figure out how many pages there are for the category being processed
    //
    $ch = curl_init();
    $timeout = 5;

    curl_setopt($ch, CURLOPT_URL, $baseURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

    $html = curl_exec($ch);
    curl_close($ch);

    $dom = new DOMDocument();
    @$dom->loadHTML($html);

    $tagCount = 0;

    foreach($dom->getElementsByTagName('ul') as $ul) {
      if (preg_match('/pagination\-sm/', $ul->getAttribute('class'))) {
        // Found pagination block - look for max list elements
        $tagCount = $ul->getElementsByTagName('li')->length;
        // Derive max pages from list elements count
        $listItems = $ul->getElementsByTagName('li');
        $maxPageCount = $listItems->item($tagCount - 2)->nodeValue;
        break;
      }
    }

    // Fetch all quotes based on $maxPageCount
    //
    $cnt = 0;
    $TXTfilename = "quotes_" . $cat . ".txt";
#    $SQLfilename = "quotes_" . $cat . ".sql";
    echo "Processing " . $maxPageCount . " pages for category '" . $cat . "' ... ";
    $fpTXT = fopen($TXTfilename, "w") or die ("Can't open " . $filename);
#    $fpSQL = fopen($SQLfilename, "w") or die ("Can't open " . $filename);

    foreach (range(1, $maxPageCount) as $number) {
      if ($number == 1) {
        $url = "http://www.brainyquote.com/quotes/topics/topic_".$cat.".html";
      } else {
        $url = "http://www.brainyquote.com/quotes/topics/topic_".$cat.$number.".html";
      }
      $ch = curl_init();
      $timeout = 5;

      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);

      $html = curl_exec($ch);
      curl_close($ch);

      $dom = new DOMDocument();

      @$dom->loadHTML($html);

      foreach($dom->getElementsByTagName('div') as $div) {
        if ($div->getAttribute('class') == "boxyPaddingBig") {
          foreach($div->getElementsByTagName('a') as $link) {
            if ($link->getAttribute('title') == "view quote") {
              $quote = $link->nodeValue;
            }
            if ($link->getAttribute('title') == "view author") {
              $author = $link->nodeValue;
            }
          }
          if ((strpos($author, ' Osteen ') !== false) || (strpos($quote, ' God ') !== false)){
            // Punt - I really don't care for the Osteen's sayings nor quotes about God
          } else {
            $cnt++;
            if ($cnt == 1) {
              $txt = "\"" . $quote . " ~ " . $author . "\"";
#              fwrite($fpSQL, "INSERT INTO 'quotes_" . $cat . "' VALUES(NULL, " . $txt . ");\n");
              fwrite($fpTXT, $txt);
            } else {
              $txt = "\"" . $quote . " ~ " . $author . "\"";
#              fwrite($fpSQL, "INSERT INTO 'quotes_" . $cat . "' VALUES(NULL, " . $txt . ");\n");
              $txt = ",\n\"" . $quote . " ~ " . $author . "\"";
              fwrite($fpTXT, $txt);
            }
          }
        }
      }
    }
    fclose($fpTXT);
#    fclose($fpSQL);
    echo $cnt - 1 . " quotes written!\n";
  }
?>
