var getTerms = function(query, callback)
{
    $.ajax({
        url: '/wikipedia_search.php',
        data: {search: query},
        success: function(response, status, xhr){
            var data = JSON.parse(response);
            
            if (data.length > 1 && data[1].length > 1)
            {
                callback(data[1]);
            }
            else if (data[1].length == 1)
            {
                getDefinition(data[1][0], showWikipediaSnnipet);
            }
            else
            {
                clearChildren(results);
                var error = document.createElement('p');
                error.appendChild(document.createTextNode('Nenhum resultado encontrado para a palavra ' + query));
                results.appendChild(error);
            }
        }
    });
};

var getDefinition = function(query, callback)
{
    $.ajax({
        url: '/wikipedia_definition.php',
        data: {titles: query},
        success: function(response, status, xhr){
            var data = JSON.parse(response);
            callback(data);
        }
    });
};

var showWikipediaSnnipet = function(content)
{
    clearChildren(results);

    for (var page in content.query.pages)
    {
        var title = document.createElement('h2'),
            snnipet = document.createElement('p'),
            link = document.createElement('a');

        title.className = 'wikipedia-article-title';
        title.appendChild(document.createTextNode(content.query.pages[page].title));
        
        snnipet.className = 'wikipedia-article-snnipet';
        snnipet.appendChild(document.createTextNode(content.query.pages[page].extract));

        link.className = 'wikipedia-article.url';
        link.appendChild(document.createTextNode('Ver o artigo completo'));
        link.href = 'http://pt.wikipedia.com/wiki/' + content.query.pages[page].title;

        results.appendChild(title);
        results.appendChild(snnipet);
        results.appendChild(link);
        
        break;
    }
};

var getPossibleWords = function(query, callback)
{
    $.ajax({
        url: '/dictionary_search.php',
        data: {term: query},
        success: function(response, status, xhr){
            var data = JSON.parse(response);
            callback(data);
        }
    });
};

var getMeaning = function(query, callback)
{
    $.ajax({
        url: '/dictionary_definition.php',
        data: {term: query},
        success: function(response, status, xhr){
            var data = JSON.parse(response);
            callback(data);
        }
    });
};

var showDictionaryDefinition = function(content)
{
    clearChildren(results);
    var title = document.createElement('h2'),
        ul = document.createElement('ul');

    title.className = 'dictionary-word-title';
    if (content.superEntry)
    {
        title.appendChild(document.createTextNode(content.superEntry[0].entry.form.orth));
        results.appendChild(title);

        for (var i = 0; i < content.superEntry.length; i++)
        {
            for (var j = 0; j < content.superEntry[i].entry.sense.length; j++)
            {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(content.superEntry[i].entry.sense[j].def));
                ul.appendChild(li);
            }
        }
    }
    else
    {
        title.appendChild(document.createTextNode(content.entry.form.orth));
        results.appendChild(title);

        for (var j = 0; j < content.entry.sense.length; j++)
        {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(content.entry.sense[j].def));
            ul.appendChild(li);
        }
    }
    
    results.appendChild(ul);
};

var clearChildren = function(parent)
{
    while (parent.firstChild)
    {
        parent.removeChild(parent.firstChild);
    }
}

var ws = document.getElementById('wikipedia_search'),
    ds = document.getElementById('dictionary_search'),
    search = document.getElementById('search'),
    results = document.getElementById('results');
    
ws.addEventListener('click', function(event){
    event.preventDefault();
    getTerms(search.value, function(terms){
        clearChildren(results);

        var ul = document.createElement('ul');
        for (var i = 0; i < terms.length; i++)
        {
            var li = document.createElement('li'),
                a = document.createElement('a');

            a.appendChild(document.createTextNode(terms[i]));
            a.href = '#';
            a.className = 'term';
            a.dataset.term = terms[i];
            a.addEventListener('click', function(event){
                event.preventDefault();
                getDefinition(this.dataset.term, showWikipediaSnnipet);
            });

            li.appendChild(a);
            ul.appendChild(li);
        }
        results.appendChild(ul);
    });
})

ds.addEventListener('click', function(event){
    event.preventDefault();
    getPossibleWords(search.value, function(words){
        clearChildren(results);

        var ul = document.createElement('ul');
        for (var i = 0; i < words.list.length; i++)
        {
            var li = document.createElement('li'),
                a = document.createElement('a');

            a.appendChild(document.createTextNode(words.list[i]));
            a.href = '#';
            a.className = 'word';
            a.dataset.word = words.list[i];
            a.addEventListener('click', function(event){
                event.preventDefault();
                getMeaning(this.dataset.word, showDictionaryDefinition);
            });

            li.appendChild(a);
            ul.appendChild(li);
        }
        results.appendChild(ul);
    });
});