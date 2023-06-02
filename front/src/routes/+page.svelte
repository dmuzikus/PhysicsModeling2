<script>
    import {Solver} from "../classes/Solution.js";
    import Chart from 'chart.js/auto';
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let ctx;
	let chartCanvas;
    let chart;

    let P = 10e12;
    let delta = 20;
    let step = 0.07;

    let solver = new Solver(delta, P, step);
    let result = solver.processBaseCase()
    let resultSpecialCase = solver.processSpecialCase()

    console.log(resultSpecialCase)
    function updateChart() {
        chart.data.datasets[1].data = result.funcValues;
        chart.data.datasets[0].data = result.bottomLimitArray;
        chart.data.datasets[2].data = result.topLimitArray;
        chart.data.labels = result.arrange;
        chart.update()
    }

    onMount(async () =>
    {
        ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: result.arrange,
                datasets: [
                    {
                        label: 'Bottom',
                        data: result.bottomLimitArray,
                        borderColor: 'orange'
                    },
                    {
                        label: 'Func',
                        data: result.funcValues,
                        cubicInterpolationMode: 'monotone',
                        borderColor: 'blue',
                        borderWidth: 2,
                    },
                    {
                        label: 'Top',
                        data: result.topLimitArray,
                        borderColor: 'red'
                    }
                    ]
            },
            options: {
                plugins: {
                  title: {
                    display: true,
                    text: 'Visualisation'
                  }
                },
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                           callback: value => value.toFixed(2)
                        }
                     }
                }
            }
        });
    }
);
</script>
<div style="display: flex; justify-content: center; height: max-content;">
    <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding-left: 2em; padding-right: 2em">
            <div style="display: flex; flex-direction: column; width: 100%; justify-content: center">
                <div style="display: flex; justify-content: center; cursor: pointer; color: blueviolet" on:click={()=>goto("/special")}>
                    Base State
                </div>
                <label>Value of "P"</label>
                <input type="number" min="0" bind:value={P} on:change={(e)=>{
                        if ((e.target.value < 0) || (e.target.value instanceof String)) P = 0
                        solver.setP(P);
                        result = solver.processBaseCase();
                        chart.data.datasets[1].data = result.funcValues;
                        chart.update()}}>
                <label>Value of "delta"</label>
                <input type=number min=10 bind:value={delta} on:change={(e)=>{
                        if ((e.target.value < 10) || (e.target.value instanceof String)) delta = 10
                        solver.setDelta(delta);
                        result = solver.processBaseCase();
                        updateChart()}}>
                <label>Value of "Step"</label>
                <input type=number min=0.001 max=1 step=0.01 bind:value={step} on:change={(e)=>{
                        if ((e.target.value <= 0) || (e.target.value instanceof String)) step = 0.07
                        solver.setStep(step);
                        result = solver.processBaseCase();
                        updateChart()}}>
                <div style="display: flex; justify-content: center; align-items: center">
                    <div style="width: 85%">
                        <canvas bind:this={chartCanvas} id="myChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
</div>

<style>
    :global(body) {
        margin: 0;
    }
</style>