-- Minimal Annex IV seed to prove the MVP loop end-to-end.
-- required_evidence_types uses the exact same values as events.event_type
-- (agent_action, tool_call, api_call, model_call, human_intervention, error,
-- system_event) so compliance mapping can match them directly with no
-- translation layer. Expand this table's rows as you cover more of the
-- annex — schema doesn't change.

insert into compliance_requirements (section_key, title, description, required_evidence_types, sort_order) values
('annex_iv_1_general_description', 'General description of the AI system', 'Intended purpose, provider identity, versions, and how the system interacts with hardware/software.', array['agent_action','system_event'], 1),
('annex_iv_2_design_specification', 'Design and development process', 'Design choices, architecture, key decisions, and the reasoning behind them.', array['model_call','agent_action'], 2),
('annex_iv_3_monitoring_and_control', 'System monitoring, functioning and control', 'How the system is monitored in production, human oversight measures, and control mechanisms in place.', array['human_intervention','system_event'], 3),
('annex_iv_4_performance_metrics', 'Performance and validation metrics', 'Accuracy, robustness, and metrics used to validate performance against intended purpose.', array['model_call','error'], 4),
('annex_iv_5_risk_management', 'Risk management measures', 'Identified risks, mitigation measures, and residual risk evaluation.', array['error','human_intervention'], 5),
('annex_iv_6_changes_log', 'Changes made through the system lifecycle', 'Log of significant changes to the system across its lifecycle.', array['system_event','tool_call'], 6);
