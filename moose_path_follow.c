#include <webots/robot.h>
#include <webots/motor.h>
#include <webots/keyboard.h>
#include <webots/gps.h>
#include <webots/compass.h>
#include <webots/lidar.h>
#include <math.h>
#include <stdio.h>

#define TIME_STEP 64
#define MAX_SPEED 6.28
#define TURN_COEFFICIENT 20

enum {
  LEFT,
  RIGHT
};

WbDeviceTag motors[2];
WbDeviceTag gps;
WbDeviceTag compass;
WbDeviceTag lidar;

int mode = 0;  // 0 = manual, 1 = autopilot

// Sample target points (x, z)
double targets[][2] = {
  {1.0, 1.0},
  {2.0, -1.0},
  {-1.0, -2.0},
  {-2.0, 1.5}
};
int current_target = 0;
int num_targets = sizeof(targets) / sizeof(targets[0]);

void set_motor_speeds(double left, double right) {
  wb_motor_set_velocity(motors[LEFT], left);
  wb_motor_set_velocity(motors[RIGHT], right);
}

void run_manual() {
  int key = wb_keyboard_get_key();
  double left = 0, right = 0;

  if (key == WB_KEYBOARD_UP) {
    left = MAX_SPEED;
    right = MAX_SPEED;
  } else if (key == WB_KEYBOARD_DOWN) {
    left = -MAX_SPEED;
    right = -MAX_SPEED;
  } else if (key == WB_KEYBOARD_LEFT) {
    left = -MAX_SPEED / 2;
    right = MAX_SPEED / 2;
  } else if (key == WB_KEYBOARD_RIGHT) {
    left = MAX_SPEED / 2;
    right = -MAX_SPEED / 2;
  }

  set_motor_speeds(left, right);
}

void run_autopilot() {
  double speeds[2] = {0.0, 0.0};

  const double *pos = wb_gps_get_values(gps);
  const double *north = wb_compass_get_values(compass);

  double dx = targets[current_target][0] - pos[0];
  double dz = targets[current_target][1] - pos[2];
  double angle_to_target = atan2(dz, dx);
  double robot_angle = atan2(north[0], north[2]);

  double beta = angle_to_target - robot_angle;

  // Normalize beta to [-π, π]
  while (beta > M_PI) beta -= 2 * M_PI;
  while (beta < -M_PI) beta += 2 * M_PI;

  double distance = sqrt(dx * dx + dz * dz);

  const float *lidar_values = wb_lidar_get_range_image(lidar);
  int lidar_resolution = wb_lidar_get_horizontal_resolution(lidar);
  int center = lidar_resolution / 2;

  // Scan for obstacles in front
  double front_distance = 100.0;
  int window = 10;
  for (int i = center - window; i <= center + window; i++) {
    if (lidar_values[i] < front_distance)
      front_distance = lidar_values[i];
  }

  if (front_distance < 1.0) {
    // Obstacle too close — perform avoidance maneuver
    printf("Obstacle detected ahead! Avoiding...\n");

    double left_avg = 0.0, right_avg = 0.0;
    for (int i = 0; i < center; i++)
      left_avg += lidar_values[i];
    for (int i = center; i < lidar_resolution; i++)
      right_avg += lidar_values[i];

    if (left_avg < right_avg) {
      speeds[LEFT] = -0.5 * MAX_SPEED;
      speeds[RIGHT] = 0.5 * MAX_SPEED;
    } else {
      speeds[LEFT] = 0.5 * MAX_SPEED;
      speeds[RIGHT] = -0.5 * MAX_SPEED;
    }
  } else {
    // No obstacle — proceed to target
    speeds[LEFT] = MAX_SPEED - TURN_COEFFICIENT * beta;
    speeds[RIGHT] = MAX_SPEED + TURN_COEFFICIENT * beta;
  }

  if (distance < 0.2) {
    printf("Reached target %d!\n", current_target);
    current_target = (current_target + 1) % num_targets;
  }

  set_motor_speeds(speeds[LEFT], speeds[RIGHT]);
}

int main() {
  wb_robot_init();

  motors[LEFT] = wb_robot_get_device("left wheel motor");
  motors[RIGHT] = wb_robot_get_device("right wheel motor");
  wb_motor_set_position(motors[LEFT], INFINITY);
  wb_motor_set_position(motors[RIGHT], INFINITY);
  set_motor_speeds(0.0, 0.0);

  gps = wb_robot_get_device("gps");
  wb_gps_enable(gps, TIME_STEP);

  compass = wb_robot_get_device("compass");
  wb_compass_enable(compass, TIME_STEP);

  lidar = wb_robot_get_device("lidar");
  wb_lidar_enable(lidar, TIME_STEP);

  wb_keyboard_enable(TIME_STEP);

  while (wb_robot_step(TIME_STEP) != -1) {
    int key = wb_keyboard_get_key();
    if (key == 'M' || key == 'm') {
      mode = 0;
      printf("Switched to Manual Mode\n");
    } else if (key == 'A' || key == 'a') {
      mode = 1;
      printf("Switched to Autopilot Mode\n");
    }

    if (mode == 0)
      run_manual();
    else
      run_autopilot();
  }

  wb_robot_cleanup();
  return 0;
}
