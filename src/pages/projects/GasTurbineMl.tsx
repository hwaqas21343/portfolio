import ProjectPage from '../../components/ProjectPage';
import DemoFrame from '../../components/DemoFrame';
import styles from './GasTurbineMl.module.css';

export default function GasTurbineMl() {
  return (
    <ProjectPage
      slug="gas-turbine-ml"
      summary={
        <div className="prose">
          <p>
            Gas turbines are tightly regulated on two emissions, carbon
            monoxide and nitrogen oxides. Both move with how the turbine is
            being run, but not in the same way or for the same reasons, so a
            model that predicts them from live sensor data has to treat them
            as genuinely separate problems rather than one shared curve.
          </p>
          <p>
            I built this as a university coursework project, a complete
            machine learning pipeline over a 35,499-row sensor dataset, from
            cleaning and exploratory analysis through to a held-out test
            evaluation, working to a fixed train/validation/test split set by
            the coursework brief so every model was compared on equal terms.
          </p>
        </div>
      }
      showcaseLabel="Results"
      showcase={
        <>
          <div className="prose">
            <p>
              Four models were compared under a fixed split, polynomial,
              ridge and lasso regression as baselines, then a tuned gradient
              boosting regressor. Gradient boosting won on both targets.
            </p>
          </div>

          <div className={styles.grid}>
            <DemoFrame
              caption="Emissions by combustion regime and operating mode"
              aspectRatio="4 / 3"
            >
              <img
                src="/media/gas-turbine-ml/eda-emissions-by-condition.png"
                alt="Four boxplots showing CO and NOx emissions split by combustion regime (lean, intermediate, rich) and operating mode (low, part, base load)"
                className={styles.figureImg}
              />
            </DemoFrame>

            <div className={styles.gridWide}>
              <DemoFrame
                caption="CO, held-out test set, gradient boosting"
                aspectRatio="4 / 3"
              >
                <img
                  src="/media/gas-turbine-ml/test-co.png"
                  alt="Scatter plot of actual versus predicted CO emissions on the held-out test set, R-squared 0.712"
                  className={styles.figureImg}
                />
              </DemoFrame>
              <DemoFrame
                caption="NOx, held-out test set, gradient boosting"
                aspectRatio="4 / 3"
              >
                <img
                  src="/media/gas-turbine-ml/test-nox.png"
                  alt="Scatter plot of actual versus predicted NOx emissions on the held-out test set, R-squared 0.652"
                  className={styles.figureImg}
                />
              </DemoFrame>
            </div>
          </div>
        </>
      }
      deepDive={
        <div className="prose">
          <p>
            Nine tasks end to end, cleaning, exploration, feature
            engineering, four models and an evaluation on data none of the
            models had seen during training.
          </p>
          <ul>
            <li>
              <strong>Data.</strong> 13 columns, 35,499 rows, 9 numerical and
              2 categorical. No missing values once loaded; duplicate rows
              and IQR-based outliers were removed and the two categorical
              fields (combustion regime, operating mode) were encoded before
              training.
            </li>
            <li>
              <strong>Exploration.</strong> Boxplots split by combustion
              regime and operating mode (above) show CO falling sharply as
              load and combustion quality improve, more complete combustion
              at higher loads, while NOx moves independently, driven more by
              temperature than by load itself.
            </li>
            <li>
              <strong>Feature engineering.</strong> Correlation analysis
              pointed to turbine inlet temperature, compressor discharge
              pressure, ambient temperature and output power as the
              strongest predictors, with a humidity-temperature ratio and a
              temperature-pressure interaction term added on top.
            </li>
            <li>
              <strong>Baselines.</strong> Polynomial, ridge and lasso
              regression, features scaled first, evaluated with MAE, RMSE
              and R² on a held-out validation split. Polynomial regression
              led the three, ridge and lasso stayed weaker and consistent
              (R² around 0.45–0.50 for NOx).
            </li>
            <li>
              <strong>Gradient boosting.</strong> scikit-learn&apos;s
              GradientBoostingRegressor, 100 estimators, learning rate 0.1,
              max depth 3, beat every baseline on both targets. Training and
              validation scores stayed close throughout, CO&apos;s R² was
              identical (0.7085) across both, which is the sign that mattered
              most. The model generalised rather than memorised.
            </li>
            <li>
              <strong>Held-out test.</strong> Evaluated once, on the 20%
              split kept untouched through every prior stage. R² of 0.712
              for CO and 0.652 for NOx, consistent with validation, the
              plots above are that final run.
            </li>
            <li>
              <strong>What it means.</strong> The two targets are driven by
              different things. CO tracks turbine load and combustion
              conditions, factors an operator can actually control, while
              NOx tracks ambient temperature, which the operator can&apos;t.
              That&apos;s the case for treating them as two problems rather
              than one.
            </li>
          </ul>
        </div>
      }
    />
  );
}
