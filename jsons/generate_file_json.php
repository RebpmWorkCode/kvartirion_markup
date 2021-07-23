<?php
$generatedFileName = 'Region_TwigTheme.json';
$regions = [];

$jsons = array_filter(scandir(__DIR__), function ($fileName) use ($generatedFileName) {
    return !in_array($fileName, ['.', '..', $generatedFileName]) && pathinfo(__DIR__ . $fileName, PATHINFO_EXTENSION) == "json";
});

foreach ($jsons as $jsonFile) {
    $content = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . $jsonFile);
    $regions[] = json_decode($content, true)[0];

}

file_put_contents(__DIR__ . DIRECTORY_SEPARATOR . $generatedFileName, json_encode($regions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
