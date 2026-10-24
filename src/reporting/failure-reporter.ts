
import type {
  FullConfig,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { explainFailure } from '../ai/failure-explainer';

class FailureReporter implements Reporter {
  private failures: Array<{
    testTitle: string;
    errorMessage: string;
    explanation?: string;
  }> = [];

  private config!: FullConfig;

  onBegin(config: FullConfig) {
    this.config = config;
    this.failures = [];
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status !== 'failed' && result.status !== 'timedOut') {
      return;
    }

    this.failures.push({
      testTitle: test.title,
      errorMessage: result.error?.message ?? 'Unknown test failure',
    });
  }

  async onEnd() {
    if (this.failures.length === 0) {
      console.log('Failure Explainer: no failed tests to analyze.');
      return;
    }

    mkdirSync('reports', { recursive: true });

    for (const failure of this.failures) {
      try {
        const explanation = await explainFailure({
          testTitle: failure.testTitle,
          errorMessage: failure.errorMessage.slice(0, 4000),
        });

        failure.explanation = explanation.explanation;

        console.log('\n=== LLM Failure Explanation ===');
        console.log('Test:', failure.testTitle);
        console.log(explanation.explanation);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        failure.explanation = `LLM explanation unavailable: ${message}`;

        console.error(
          `Failure Explainer could not analyze "${failure.testTitle}": ${message}`,
        );
      }
    }

    const outputPath = join('reports', 'failure-explanations.json');
    writeFileSync(
      outputPath,
      JSON.stringify(this.failures, null, 2),
      'utf8',
    );

    console.log(`Failure explanations saved to ${outputPath}`);
  }
}

export default FailureReporter;
