import { LabEvaluator, TaskValidationRule } from "../evaluator/evaluator.js";

async function runEvaluatorTests() {
  console.log("==================================================");
  console.log(" Running KubeLab Infrastructure Evaluator Tests");
  console.log("==================================================");

  // Initialize evaluator in mock/standalone mode
  const evaluator = new LabEvaluator({} as any, false);

  const testTasks: { id: string; title: string; validation_config: TaskValidationRule }[] = [
    {
      id: "task-1",
      title: "Deploy Nginx Pod",
      validation_config: { resourceType: "pod", name: "nginx-web", expectedStatus: "Running" },
    },
    {
      id: "task-2",
      title: "Create 3 Replicas",
      validation_config: { resourceType: "deployment", name: "webapp-deployment", expectedReplicas: 3 },
    },
    {
      id: "task-3",
      title: "Expose Service Port 80",
      validation_config: { resourceType: "service", name: "webapp-service", expectedPort: 80 },
    },
  ];

  const summary = await evaluator.evaluateLab("lab-session-test01", testTasks, 100);

  console.log(`Evaluator Result Success: ${summary.success}`);
  console.log(`Total Tasks: ${summary.totalTasks}, Passed: ${summary.passedTasks}`);
  console.log(`Points Earned: ${summary.pointsEarned} / 100`);

  if (!summary.success || summary.passedTasks !== 3 || summary.pointsEarned !== 100) {
    console.error("❌ Evaluator test failed!");
    process.exit(1);
  }

  console.log("✔ All Evaluator unit tests passed successfully!");
}

runEvaluatorTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
