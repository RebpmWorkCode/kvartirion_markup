<?php
$generatedFileName = 'Region_TwigTheme.json';
$regions = [];

$jsons = array_filter(scandir(__DIR__), function ($fileName) use ($generatedFileName) {
    return !in_array($fileName, ['.', '..', $generatedFileName]) && pathinfo(__DIR__ . $fileName, PATHINFO_EXTENSION) == "json";
});

$sorted = [
    'Regions_twig_head.json',
    'Regions_twig_end_page.json',
    'Regions_twig_header.json',
    'Regions_twig_footer.json',
    'Regions_twig_realty_index.json',
    //twig_realty_view
    'Regions_twig_realty_main.json',
    //twig_realty_map
    'Regions_twig_realty_form.json',
    'Regions_twig_favorites_index.json',
    'Regions_twig_feedback_send.json',
    //twig_nodes_index
    //twig_nodes_view
    //twig_services_index
    //twig_services_view
    //twig_news_index
    //twig_news_view
    'Regions_twig_reviews_index.json',
    //twig_reviews_view
    'Regions_twig_users_index.json',
    //twig_users_view
    //twig_contacts_view
];
$sortedNew = [];

foreach ($jsons as $jsonFile) {
    if (in_array($jsonFile, $sorted)) {
        continue;
    }
    $sorted[] = $jsonFile;
}
foreach ($sorted as $fileName) {
    $content = file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . $fileName);
    $content = json_decode($content, true)[0];
    $regions[] = $content;
}
file_put_contents(__DIR__ . DIRECTORY_SEPARATOR . $generatedFileName, json_encode($regions, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
