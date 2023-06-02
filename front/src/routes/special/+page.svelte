<script>
    import {Solver} from "../../classes/Solution.js";
    import Chart from 'chart.js/auto';
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let ctx;
	let chartCanvas;
    let chart;

    let a = 1;
    let n = 2;
    let step = 0.01;

    let solver = new Solver();
    solver.setStep(step)
    solver.setN(n)
    solver.setA(a);
    let resultSpecialCase = solver.processSpecialCase()

    function updateChart() {
        resultSpecialCase = solver.processSpecialCase();
        chart.data.datasets[0].data = resultSpecialCase.y;
        chart.data.labels = resultSpecialCase.x;
        chart.update()
    }

    onMount(async () =>
    {
        ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: resultSpecialCase.x,
                datasets: [
                    {
                        data: resultSpecialCase.y,
                        label: 'E(k)',
                    },
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
                <div style="display: flex; justify-content: center; cursor: pointer; color: blueviolet" on:click={()=>goto("/")}>
                    Special State
                </div>
                <label>Value of "a"</label>
                <input type=number min=1 step=1 bind:value={a} on:change={(e)=>{
                        if ((e.target.value < 1) || (e.target.value instanceof String)) a = 1
                        solver.setA(a);
                        updateChart()}}>
                <label>Value of "n"</label>
                <input type=number min=1 step=1 bind:value={n} on:change={(e)=>{
                        if ((e.target.value < 1) || (e.target.value instanceof String)) n = 1
                        solver.setN(n);
                        updateChart()}}>
                <label>Value of "Step"</label>
                <input type=number min=0.001 max=1 step=0.01 bind:value={step} on:change={(e)=>{
                        if ((e.target.value <= 0) || (e.target.value instanceof String)) step = 0.01
                        solver.setStep(step);
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