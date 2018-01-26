const currentPage = location.href.split("/").slice(-1);

fetch('/api/v1/weather?location=' + currentPage[0])
    .then((resp) => resp.json())
    .then(function(data) {
        let dataTime = ['time']
        let dataTemp = ['temperature']
        
        // console.log(data);

        data.map(function(obj){
            dataTime.push(Date.parse(obj.time))
            dataTemp.push(obj.temperature)
        })

        c3.generate({
            bindto: '#chart',
            data: {
                x: 'time',
                columns: [
                    dataTime, dataTemp
                ]
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        count: 10,
                        format: '%Y-%m-%d %H:%M:%S'
                    }
                }
            }
        });         
    })
    .catch(function(error) {console.error(error)});