fetch('/api/v1/weather?location=' + location)
    .then((resp) => resp.json())
    .then(function(data) {
        var dataTime = ['time']
        var dataTemp = ['temperature']
        
        data.map(function(obj){
            dataTime.push(Date.parse(obj.time))
            dataTemp.push(obj.temp)
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