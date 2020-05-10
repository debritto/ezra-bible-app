/* This file is part of Ezra Project.

   Copyright (C) 2019 - 2020 Tobias Klein <contact@ezra-project.net>

   Ezra Project is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Ezra Project is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Ezra Project. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

class VerseStatisticsChart {

  getVerseStatisticsChart(tabIndex=undefined) {
    var currentVerseListFrame = bible_browser_controller.getCurrentVerseListFrame(tabIndex);
    return currentVerseListFrame.find('.verse-statistics-chart');
  }

  resetChart(tabIndex=undefined) {
    var currentVerseListFrame = bible_browser_controller.getCurrentVerseListFrame(tabIndex);
    var container = currentVerseListFrame.find('.verse-statistics-chart-container');

    container.hide();
    container.empty();

    var canvasElement = "<canvas class='verse-statistics-chart'></canvas>";
    container.append(canvasElement);
  }

  updateChart(tabIndex=undefined, bibleBookStats) {
    var currentTab = bible_browser_controller.tab_controller.getTab(tabIndex);
    var currentSearchResults = currentTab.getSearchResults();

    var labels = [];
    var dataRow = [];

    var bookMap = models.BibleBook.getBookMap();

    for (var book in bookMap) {
      labels.push(book);

      var value = 0;
      if (book in bibleBookStats) {
        value = bibleBookStats[book];
      }

      dataRow.push(value);
    }

    var data = {
      labels: labels,
      datasets: [{
          data: dataRow,
          borderWidth: 1
      }]
    };

    var chartElement = this.getVerseStatisticsChart(tabIndex);
    
    var verseStatisticsBarChart = new Chart(chartElement, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scaleShowValues: true,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
              fontSize: 9
            }
          }]
        }
      }
    });

    $(chartElement).parent().show();
  }
}

module.exports = VerseStatisticsChart;